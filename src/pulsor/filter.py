import subprocess
import time

i = 1

while 1:
    value = subprocess.run(["./pulsor.sh"])
    print(value)
    i = i + 1
    time.sleep(5)