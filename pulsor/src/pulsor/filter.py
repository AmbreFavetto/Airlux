import subprocess
import time
import paho.mqtt.client as mqtt
import datetime

i = 1
host = "mqtt"
port = 1883
client = mqtt.Client()

client.connect(host, port)
print("Client connecté")

client.publish("MESSAGE", "salut")
print("Publish MESSAGE ok")

while 1:
    value = subprocess.run(["/var/pulsor/pulsor.sh"])
    print(value)
    valueToPublish = ("HSET number:%s value '%s' timestamp '%s'" % (i, value.returncode, datetime.datetime.now()))
    print(valueToPublish)
    client.publish("PULSOR", valueToPublish)
    print("Pulsor published")
    i = i + 1
    time.sleep(5)