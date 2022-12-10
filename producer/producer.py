# VM  ip 13.234.117.189

import time
import json
import pika
from datetime import datetime
import threading
# connection = pika.BlockingConnection(
#     pika.ConnectionParameters(host='172.26.1.243', port=5672, socket_timeout=2))
# channel = connection.channel()

# channel.exchange_declare(exchange='logs', exchange_type='fanout')

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
    cursor.execute("""
    SELECT * from bus_data where sr_num=1;
    """)
    print(cursor.fetchall())

    
    time_now = datetime.now().time() # time object

    # threading to query every n seconds
    sn = 0
    def query_n_secs(sn,cursor):
        #threading.Timer(4.0,query_n_secs).start()
        sn += 4
        cursor.execute("""
        "Select * from bus_data where sr_num=%(int)s"
        VALUES (%(int)s, %(date)s, %(date)s, %(str)s);
        """,
        {'int': sn})
        print(cursor.fetchall())
        time.sleep(3)
            
    query_n_secs(0,cursor)
    # psql_select_query = "Select * from bus_data where sr_num=1"

    # cursor.execute(psql_select_query)
    # print("Selecting all rows in bus_table")

    # bus_records = cursor.fetchall()
    # i = 0

    # for row in bus_records:
    #     i += 1
    #     message = json.dumps(row, default=str)
    #     channel.basic_publish(exchange='logs', routing_key='', body=message)

    # connection.close()

except (Exception, psycopg2.Error) as error:
    print(error)
    print("Error while fetching data from DB 1")
