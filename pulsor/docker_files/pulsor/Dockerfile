FROM python:3.8
RUN pip install subprocess.run
RUN pip install python-time
RUN pip3 install paho-mqtt python-etcd
RUN pip install datetime
CMD [ "python", "/var/pulsor/filter.py" ]