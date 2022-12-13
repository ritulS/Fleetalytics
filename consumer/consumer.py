import pika
import redis
import json
from math import radians, cos, sin, asin, sqrt
#import mysql.connector
from sqlalchemy import create_engine
from datetime import datetime
import psycopg2


## Connecting to DB 2
#conn = psycopg2.connect(
#    "dbname='db1' user='postgres' password='postgres' host='localhost'"
#)
#print('Connected to DB 1')
#cursor = conn.cursor()

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
    return REDIS.get(id)


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


def push_to_db(data:list, connection):
    '''
    data format:
    [1, "02-12-2019", "10:04:53", "A41121", 460.0, -22.98354, -43.217812, 0.0, "D", 02-12-2019, 10:04:53] 
    '''
    res = cursor.execute("INSERT INTO bus_data (sr_num, date0, time0, vin, \
        route, latitude, longitude, speed, type, date, time ) VALUES(%s, %s, %s,%s, %s, %s, %s, %s, %s,%s, %s)"\
        , (data[0], data[1], data[2], data[3], data[4], data[5], data[6], data[7],\
             data[8], data[9], data[10]))



def calculate_distance(cur_data: list) -> int:
    '''
    [1, "02-12-2019", "10:04:53", "A41121", 460.0, -22.98354, -43.217812, 0.0, "D", 02-12-2019, 10:04:53]                                       ", "10:32:33                      ", "A48044    ", 426.0, -22.970619, -43.188637, 41.48, "E    "]
    Calculate the distance using coordinates
    input => lt1, lt2, lg1, lg2
    Output => distance between prev gps and cur gps in KM
    '''
    prev_data = get_from_cache(cur_data[3]) #json format from cache
    prev_data_dict = json.loads(prev_data) #list format
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
      
    # calculate the result
    return int(c * r)
    
    


def rbmq_callback(ch, method, properties, body: str):
    '''
    Callback function for rabbitmq

    body:str - sent in the format "id:'{}'" where '{}' is in JSON format

    Cache format

    carStatus:{
        vin: cid as string,
        fuel: 0,
        speed: 0,
        location: [0, 0] as [long, lat],
        avg_distance: 0,
        avg_speed: 0,
    },
    '''
    print(" [x] Received %r" % body)
    body_arr = body.split(':')
    id = body_arr[0]
    value = body_arr[1]
    # convert json to py list
    data = json.loads(body)

    # call distance function

    #push_to_db(data)
    #value = generate_cache_data() -> has to be in the format of carStatus
    push_to_cache(id, value)


def connect_to_rbmq_broker():
    #make connection with producer
    connection = pika.BlockingConnection(pika.ConnectionParameters(host='rabbitmq.broker', port=5672))
    #setup channel with producer
    channel = connection.channel()
    print("Connection with RMQP established")
    #declaring an exchange
    channel.exchange_declare(exchange='logs', exchange_type='fanout')

    # creating q queue
    queue = channel.queue_declare(queue='car_logs_queue', exclusive=True)
    car_logs_queue = queue.method.queue

    # binding our queue to the exchange
    channel.queue_bind(exchange='logs', queue=car_logs_queue)

    channel.basic_consume(queue=car_logs_queue,
                          auto_ack=True,
                          on_message_callback=rbmq_callback)

    print('Waiting for messages')

    channel.start_consuming()


def main():
    connect_to_redis_cache(host="redis.cache", port=6379, password="hello")
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
