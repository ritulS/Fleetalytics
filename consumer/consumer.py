import pika
import redis
#import mysql.connector

REDIS: redis.Redis


def connect_to_redis_cache(host: str, port: int, password: str):
    global REDIS
    REDIS = redis.Redis(host=host, port=port, password=password)


def push_to_cache(id: str, value: str):
    global REDIS
    REDIS.set(id, value)
    print(f"set value {id} with {value}")


def push_to_db(data):
    pass


def rbmq_callback(ch, method, properties, body: str):
    """
    Callback function for rabbitmq

    body:str - sent in the format "id:'{}'" where '{}' is in JSON format
    """
    print(" [x] Received %r" % body)
    body_arr = body.split(':')
    id = body_arr[0]
    value = body_arr[1]
    #push_to_cache(id, value)


def connect_to_rbmq_broker(ip: str):
    #make connection with producer
    connection = pika.BlockingConnection(pika.ConnectionParameters(host=ip))
    #setup channel with producer
    channel = connection.channel()

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
    #connect_to_redis_cache()
    connect_to_rbmq_broker("rabbitmq")


if __name__ == '__main__':
    try:
        main()
    except KeyboardInterrupt:
        print('Interrupted')
        try:
            exit(0)
        except SystemExit:
            exit(0)
