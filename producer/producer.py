# VM  ip 13.234.117.189

import time
import json
import pika
from datetime import datetime
import threading

connection = pika.BlockingConnection(
    pika.ConnectionParameters(host='172.26.1.243', port=5672, socket_timeout=2))
channel = connection.channel()

channel.exchange_declare(exchange='logs', exchange_type='fanout')

# print("Vin number sent")

import psycopg2

# Connect with local postgres DB
try:
    #print('before conn')
    conn = psycopg2.connect(
        "dbname='db1' user='postgres' password='postgres' host='localhost'"
    )
    print('Connected to DB 1')
    cursor = conn.cursor()

    batch_num = 1
    while True:
        batch_str = "SELECT * from bus_data where sr_num={};".format(batch_num)
        cursor.execute(batch_str)
        batch_num += 1 
        batch_data = cursor.fetchall()
        print(type(batch_data))

        for i in batch_data:
            # convert tuple to json
            message = json.dumps(i, default=str)
            ###### send using rmqp
            channel.basic_publish(exchange='logs', routing_key='', body=message)

        time.sleep(3)

        # if batch_num > 1:
        #     break



    # connection.close()

except (Exception, psycopg2.Error) as error:
    print(error)
    print("Error while fetching data from DB 1")
