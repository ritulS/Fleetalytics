FROM python:3


RUN apt update
RUN apt install python3 -y
RUN pip install pika,sys,os
#RUN pip install -r requirements.txt

WORKDIR /usr/app/src

COPY ./consumer.py ./


CMD [ "python3", "./consumer.py" ]