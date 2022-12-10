import pika
import redis
import json
#import mysql.connector

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


def push_to_db(data):
    pass


def calculate_distance(cur_data: str) -> int:
    '''
    Calculate the distance using coordinates
    '''
    return 0


def rbmq_callback(ch, method, properties, body: str):
    '''
    Callback function for rabbitmq

    body:str - sent in the format "id:'{}'" where '{}' is in JSON format
    ["2019-01-25", "08:50:39", "C51623", 371.0, "-22.883270", "-43.342560", 37.0]

    Cache format

    carStatus:{
        cid: cid as string,
        fuel: 0,
        speed: 0,
        location: [0, 0] as [number, number],
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

    #push_to_db(body)
    push_to_cache(id, value)


def connect_to_rbmq_broker(ip: str):
    #make connection with producer
    connection = pika.BlockingConnection(pika.ConnectionParameters(host=ip))
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
    #TODO - write host, port, password
    connect_to_redis_cache(host="redis.cache", port=6379, password="hello")
    connect_to_rbmq_broker("rabbitmq3")


if __name__ == '__main__':
    try:
        main()
    except KeyboardInterrupt:
        print('Interrupted')
        try:
            exit(0)
        except SystemExit:
            exit(0)
