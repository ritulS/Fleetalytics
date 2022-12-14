import pika
import redis
import json
from math import radians, cos, sin, asin, sqrt
#import mysql.connector
from datetime import datetime
import psycopg2
import codecs 
import geopy.distance

####### DB CONNECTION FOR SERVER IMPLEMENTATION #############
## Connecting to DB 2
#conn = psycopg2.connect(
#    "dbname='db1' user='postgres' password='postgres' host='localhost'"
#)
#print('Connected to DB 1')
#cursor = conn.cursor()

####### DB CONNECTION FOR LOCAL TESTING #############
## Connecting to DB 2
# connection = psycopg2.connect(
#     "dbname='db2' user='postgres' password='postgres' host='localhost'"
# )
# print('Connected to DB 2')
# cursor = connection.cursor()


####### DB CONNECTION FOR LOCAL TESTING using container db #############
## Connecting to DB 2
connection = psycopg2.connect(
    "dbname='db2' user='postgres' password='password' host='localhost' port='5439'"
)
print('Connected to DB 2')
cursor = connection.cursor()


REDIS: redis.Redis


def connect_to_redis_cache(host: str, port: int, password: str):
    global REDIS
    REDIS = redis.Redis(host=host, port=port, password=password)


def get_from_cache(id: str):
    '''
    Get value from cache 
    - should be in JSON format
    '''
    global REDIS    
    
    return json.loads(REDIS.get(id))


def push_to_cache(id: str, value: str):
    '''
    Push value to cache 
        Parameters:
            id: DUH!?
            value: must be in JSON format
    '''
    global REDIS
    REDIS.set(id, value)
    print(f"set value {id} with {value}")


def push_to_db(data:list,delta_dist,connection):
    '''
    data format:
    [1, "02-12-2019", "10:04:53", "A41121", 460.0, -22.98354, -43.217812, 0.0, "D", 02-12-2019, 10:04:53] 
    '''
    cursor.execute("INSERT INTO bus_data (sr_num, date0, time0, vin, \
        route, latitude, longitude, speed, type, date, time, delta_d ) VALUES(%s, %s, %s,%s, %s, %s, %s, %s, %s,%s, %s, %s)"\
        , (data[0], data[1], data[2], data[3], data[4], data[5], data[6], data[7],\
             data[8], data[9], data[10], delta_dist))
    connection.commit()


def calculate_distance(cur_data: list) -> int:
    '''
    [1, "02-12-2019", "10:04:53", "A41121", 460.0, -22.98354, -43.217812, 0.0, "D", 02-12-2019, 10:04:53]                                       ", "10:32:33                      ", "A48044    ", 426.0, -22.970619, -43.188637, 41.48, "E    "]
    Calculate the distance using coordinates
    input => lt1, lt2, lg1, lg2
    Output => distance between prev gps and cur gps in KM
    '''
    prev_data = get_from_cache(cur_data[3]) #json format from cache
    print(type(prev_data))
    prev_data_dict = prev_data #dict format
    prev_lat = prev_data_dict['location'][0] # prev latitude
    prev_long = prev_data_dict['location'][1] # prev longitude

    cur_lat = cur_data[6] # Cur latitude
    cur_long = cur_data[5]# Cur longitude

    # Haversine formula
    dlon = cur_long - prev_long
    dlat = cur_lat - prev_lat
    a = sin(dlat / 2)**2 + cos(prev_lat) * cos(cur_lat) * sin(dlon / 2)**2
 
    c = 2 * asin(sqrt(a))
    
    # Radius of earth in kilometers. Use 3956 for miles
    r = 6371
    coords_1 = (prev_lat, prev_long)
    coords_2 = (cur_lat, cur_long)
    dist = geopy.distance.geodesic(coords_1, coords_2).km
    # calculate the result
    return dist
    

########### Function to add avg_dist and convert to cache format
def to_cache_format(data:list, avg_dist):
    # list to dict
    # list format: Prod format
    # add avg_distance
    template = {
        'vin': str(data[3]),
        'fuel': 0,
        'speed': data[7],
        'location': [data[6], data[5]],
        'avg_distance': avg_dist,
        'avg_speed': 0,
        'time': data[-1]
    }

    return template


def avg_speed_dist(ndata:list):
    # ndata: list () 
    # pdata: dict from cache
    pdata = get_from_cache(ndata[3]) # prev data as dict
    cur_time = ndata[-1]
    prev_time = pdata['time']
    delta_dist = calculate_distance(ndata)   
    prev_avg_dist = pdata['avg_distance']

    ### Avg Distance Calc
    FMT = '%H:%M:%S'
    tdelta = datetime.strptime(cur_time, FMT) - datetime.strptime(prev_time, FMT)
    tdelta_in_hours = tdelta.total_seconds() / (60*60)
    

    m = 12 - tdelta_in_hours
    avg_dist = (prev_avg_dist * m + delta_dist)/(12)

    ### Avg Speed Calc
    # elapsed_time = (12*60) - 
    # avg_speed = ((prev_avg_dist + new_dist)/12)/


    return avg_dist


def rbmq_callback(ch, method, properties, body):
    '''
    Callback function for rabbitmq

    body:json format 
    convert to list: Prod format
    ###### IMP #########
    Prod format: [sr_num, date0, time0, vin,route, latitude, longitude, speed, type, date, time] 
    Prod format example: [1, "02-12-2019", "10:04:53", "A41121", 460.0, -22.98354, -43.217812, 0.0, "D", 02-12-2019, 10:04:53] 
    '''
    #print(type(body))
    #print(" [x] Received %r" % body)
    # body_arr = body.split(':')
    # id = body_arr[0]
    # value = body_arr[1]
    # convert json to py list
    body_str = codecs.decode(body,'UTF-8')
    data = json.loads(body_str)
    #print(type(data))
    ### Calculate delta dist
    print(data)
    delta_dist = 0
    vin = data[3]
    if REDIS.get(vin) == None:
        delta_dist = 0
        avg_dist = 0
        print("reached null place")
    else:

        delta_dist = calculate_distance(data)# units: KM
        print("Delta dist calculated")
        ### Calculate avg distance
        avg_dist = avg_speed_dist(data)

    ### Push to db2
    print(data) 
    push_to_db(data,delta_dist,connection)
    print("reached db push")


    ### Convert to cache format and add avg_dist
    '''    
    Cache format  
    carStatus:{
        'vin': cid as string,
        'fuel': 0,
        'speed': 0,
        'location': [0, 0] as [long, lat],
        'avg_distance': 0,
        'avg_speed': 0,
    }'''
    cache_data = to_cache_format(data,avg_dist)
    print("cache data generated")
    print(type(cache_data))
    ### Push to cache
    vin = data[3]
    push_to_cache(vin, json.dumps(cache_data))
   

    
    #value = generate_cache_data() -> has to be in the format of carStatus
    #push_to_cache(id, value)


def connect_to_rbmq_broker():
    #make connection with producer
    connection = pika.BlockingConnection(pika.ConnectionParameters(host='localhost', port=5672))
    print("Connection setup")
    #setup channel with producer 
    channel = connection.channel()
    print("Connection with RMQP established")
    #declaring an exchange
    channel.exchange_declare(exchange='logs', exchange_type='fanout')
    channel.queue_declare(queue='fleetalytics')

    # # creating q queue
    # queue = channel.queue_declare(queue='car_logs_queue', exclusive=True)
    # car_logs_queue = queue.method.queue

    # # binding our queue to the exchange
    # channel.queue_bind(exchange='logs', queue=car_logs_queue)

    channel.basic_consume(queue='fleetalytics',
                          auto_ack=True,
                          on_message_callback=rbmq_callback)

    print('Waiting for messages')

    channel.start_consuming()


def main():
    connect_to_redis_cache(host="localhost", port=6379, password="hello")
    connect_to_rbmq_broker()


if __name__ == '__main__':
    try:
        main()
    except KeyboardInterrupt:
        print('Interrupted')
        try:
            exit(0)
        except SystemExit:
            exit(0)
