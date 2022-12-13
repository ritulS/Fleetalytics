# VM  ip 13.234.117.189

import time
import json
import pika
from datetime import datetime
import threading
import psycopg2
from datetime import datetime, date

connection = pika.BlockingConnection(
  pika.ConnectionParameters(host='localhost',
                            port=5672))

channel = connection.channel()

channel.queue_declare(queue='fleetalytics')

#channel.exchange_declare(exchange='logs', exchange_type='fanout')

# print("Vin number sent")


######################
def add_cur_date_time(row: list):
  # add current date and time to data before sending to server
  # date format: yyyy-mm-dd
  # time format: HH:MI:SS
  cur_date = datetime.today().strftime('%Y-%m-%d')
  cur_time = datetime.now().strftime("%H:%M:%S")
  del row[-1]
  del row[-1]  
  row.append(cur_date)
  row.append(cur_time)

  return row


try:
  # Connect with local postgres DB
  # print('before conn')
  conn = psycopg2.connect(
    "dbname='db1' user='postgres' password='postgres' host='localhost'")
  print('Connected to DB 1')
  cursor = conn.cursor()

  batch_num = 1
  while True:
    ### Get iter batch from DB1
    batch_str = "SELECT * from bus_data where sr_num={};".format(batch_num)
    cursor.execute(batch_str)
    batch_num += 1
    batch_data = cursor.fetchall()
    #print(type(batch_data))
    ctr = 0
    for i in batch_data:
      ctr += 1
      # convert tuple to list
      l = list(i)
      
      m = add_cur_date_time(l)
      print(m)
      # convert list to json
      message = json.dumps(m, default=str)
      # print(type(message))
      # test = json.loads(message)
      # print(type(test))
      ### send using rmqp
      channel.basic_publish(exchange='',
                            routing_key='fleetalytics',
                            body=message)
      print("row number: ", ctr)

    time.sleep(3)

    if batch_num > 1:
      break

  connection.close()

except (Exception, psycopg2.Error) as error:
  print(error)
  print("Error while fetching data from DB 1")
