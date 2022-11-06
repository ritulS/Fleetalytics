import time
import pika

connection = pika.BlockingConnection(pika.ConnectionParameters('localhost'))
channel = connection.channel()

channel.queue_declare('telematics')

def callback(ch, method, properties, body):
    print(" [x] Received %r" % body)
    
channel.basic_consume(queue='hello',
                      auto_ack=True,
                      on_message_callback=callback)

