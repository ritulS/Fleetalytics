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

import psycopg2

# Connect with local postgres DB
try: 
    print('before conn')
    conn = psycopg2.connect("dbname='bus_data' user='postgres' password='postgres' host='localhost'")
    print('after conn')
    cursor = conn.cursor()
    psql_select_query = "SELECT * FROM bus_table"

    cursor.execute(psql_select_query)
    print("Selecting all rows in bus_table")

    bus_records = cursor.fetchall()
    i = 0
    for row in bus_records:
        i += 1
        print(row)
        if i > 5:
            break
    
    


except (Exception, psycopg2.Error) as error:
    print("Error while fetching data from DB 1")
    print(error)


