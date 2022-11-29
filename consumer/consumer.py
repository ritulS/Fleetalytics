import time
import pika
import sys, os
#import mysql.connector


def main():
    #make connection with producer
    connection = pika.BlockingConnection(pika.ConnectionParameters(host='localhost', port='5672'))

    #setup channel with producer
    channel = connection.channel()

    #mention exchange to be used
    channel.exchange_declare(exchange='logs', exchange_type='fanout')

    # Bind to queue automatically
    result = channel.queue_declare(queue='', exclusive=True)
    queue_name = result.method.queue
    channel.queue_bind(exchange='logs', queue=queue_name)


    def callback(ch, method, properties, body):
        print(" [x] Received %r" % body)

    channel.basic_consume(queue=queue_name,
                        auto_ack=True,
                        on_message_callback=callback)

    print('Waiting for messages')

    channel.start_consuming()

if __name__ == '__main__':
    try:
        main()
    except KeyboardInterrupt:
        print('Interrupted')
        try:
            sys.exit(0)
        except SystemExit:
            os.exit(0)