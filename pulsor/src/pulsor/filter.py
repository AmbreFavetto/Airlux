import subprocess
import time
import paho.mqtt.client as mqtt
import datetime
from enum import Enum

class Sensor(Enum):
    TEMPERATURE = 1
    HUMIDITY = 2
    PRESSURE = 3

i = 1
host = "mqtt"
port = 1883
client = mqtt.Client()

client.connect(host, port)
print("Client connecté")

client.publish("MESSAGE", "salut")
print("Publish MESSAGE ok")

temperatureValues = []
humidityValues = []
pressureValues = []

sensorId = 1

def publish(i, value, date, sensorType):
    valueToPublish = ("HSET number:%s value '%s' timestamp '%s'" % (i, value, date))
    print(valueToPublish)
    client.publish(sensorType, valueToPublish)
    print("%s published" % (sensorType))


while 1:
    pulsorValue = subprocess.run(["/var/pulsor/pulsor.sh"])
    print(pulsorValue)

    # ----- FILTER TEMPERATURE -----
    if (sensorId == Sensor.TEMPERATURE.value):
        if (len(temperatureValues) == 10):
            temperatureValues.pop(0)

        temperatureValues.append(pulsorValue.returncode)

        if (len(temperatureValues) == 10):
            if pulsorValue.returncode > temperatureValues[9] :
                x = pulsorValue.returncode - temperatureValues[9]
            else :
                x = temperatureValues[9] - pulsorValue.returncode

            if (x < 5):
                publish(i, pulsorValue.returncode, datetime.datetime.now(), "TEMPERATURE")
                i = i + 1
            else:
                print("Valeur TEMPERATURE pas ok")
        else:
            publish(i, pulsorValue.returncode, datetime.datetime.now(), "TEMPERATURE")
            i = i + 1

    # ----- FILTER HUMIDITY -----
    if (sensorId == Sensor.HUMIDITY.value):
        if (len(humidityValues) == 10):
            humidityValues.pop(0)

        humidityValues.append(pulsorValue.returncode)

        if (len(humidityValues) == 10):
            if pulsorValue.returncode > humidityValues[9] :
                x = pulsorValue.returncode - humidityValues[9]
            else :
                x = humidityValues[9] - pulsorValue.returncode

            if (x < 50):
                publish(i, pulsorValue.returncode, datetime.datetime.now(), "HUMIDITY")
                i = i + 1
            else:
                print("Valeur HUMIDITY pas ok")
        else:
            publish(i, pulsorValue.returncode, datetime.datetime.now(), "HUMIDITY")
                i = i + 1
            
    # ----- FILTER PRESSURE -----
    if (sensorId == Sensor.PRESSURE.value):
        if (len(pressureValues) == 10):
            pressureValues.pop(0)

        pressureValues.append(pulsorValue.returncode)

        if (len(pressureValues) == 10):
            if pulsorValue.returncode > pressureValues[9] :
                x = pulsorValue.returncode - pressureValues[9]
            else :
                x = pressureValues[9] - pulsorValue.returncode

            if (x < 100):
                publish(i, pulsorValue.returncode, datetime.datetime.now(), "PRESSURE")
                i = i + 1
            else:
                print("Valeur PRESSURE pas ok")
        else:
            publish(i, pulsorValue.returncode, datetime.datetime.now(), "PRESSURE")
                i = i + 1
    
    else:
        print("Valeur SENSOR ID pas ok")
        print(sensorId)

    #time.sleep(5)