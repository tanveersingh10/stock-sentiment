FROM python:3.8-slim-bullseye

WORKDIR /app

COPY . .

RUN pip install -r requirements.txt

EXPOSE 5000

CMD ["python3", "./application.py"]
