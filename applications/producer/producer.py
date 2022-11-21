# import time
# import json
# import pika

# connection = pika.BlockingConnection(pika.ConnectionParameters('localhost'))
# channel = connection.channel()

# channel.queue_declare(queue='telematics')

# channel.basic_publish(exchange='',
#                         routing_key='telematics',
#                         body='Vin:1234')

# print("Vin number sent")
# connection.close()




