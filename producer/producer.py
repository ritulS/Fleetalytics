# VM  ip 13.234.117.189

import time
import json
import pika

connection = pika.BlockingConnection(pika.ConnectionParameters(host='localhost', port=5672))
channel = connection.channel()

channel.exchange_declare(exchange='logs', exchange_type='fanout')



# print("Vin number sent")
# connection.close()

import psycopg2


# Connect with local postgres DB
try: 
    #print('before conn')
    conn = psycopg2.connect("dbname='bus_data' user='postgres' password='postgres' host='localhost'")
    #print('after conn')
    cursor = conn.cursor()
    psql_select_query = "SELECT * FROM bus_table"

    cursor.execute(psql_select_query)
    print("Selecting all rows in bus_table")

    bus_records = cursor.fetchall()
    i = 0
    for row in bus_records:
        i += 1
        message = json.dumps(row,default=str)
        channel.basic_publish(exchange='logs',
                        routing_key='',
                        body=message)
       
    connection.close()
            
    


except (Exception, psycopg2.Error) as error:
    print(error)
    print("Error while fetching data from DB 1")
    


