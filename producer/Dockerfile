FROM python:3


RUN apt update
RUN apt install python3 -y
#RUN pip install -r requirements.txt

WORKDIR /usr/app/src

COPY ./producer.py ./

CMD [ "python3", "./producer.py" ]