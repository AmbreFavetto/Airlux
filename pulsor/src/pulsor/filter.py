import subprocess
import time
import paho.mqtt.client as mqtt
# import datetime

# print(datetime.datetime.now())
i = 1
host = "mqtt"
port = 1883
print("ok 1")
client = mqtt.Client()
print("ok 2")

client.connect(host, port)
print("ok 3")
# while 1:
#     value = subprocess.run(["/var/pulsor/pulsor.sh"])
#     print(value)
#     # print(datetime.datetime.now())
#     i = i + 1

#     time.sleep(5)