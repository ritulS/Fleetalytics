FROM python:3

WORKDIR /consumer
COPY ./consumer.py ./
COPY ./poetry.lock ./
COPY ./poetry.toml ./
COPY ./pyproject.toml ./

RUN pip install poetry
RUN poetry install 

EXPOSE 5672

CMD [ "poetry", "run", "python", "consumer.py"]

