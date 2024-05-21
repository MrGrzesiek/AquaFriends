FROM python:3.10-slim

WORKDIR /app
COPY requirements.txt requirements.txt
RUN python -m pip install --upgrade pip &&\
    python -m pip install -r requirements.txt

EXPOSE 5000

COPY . .

SHELL ["/bin/bash", "-c"]

ENV FLASK_APP=app.py
CMD ["python3" "app.py"]