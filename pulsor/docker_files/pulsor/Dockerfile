FROM python:3.8
RUN pip install subprocess.run
RUN pip install python-time
RUN pip3 install paho-mqtt python-etcd
# RUN pip install datetime
#RUN apk add --update python3
# COPY /src/pulsor /pulsor
#CMD tail -f /dev/null
#CMD [ "bash", "/var/pulsor/pulsor.sh" ]
# CMD [ "python", "/var/pulsor/filter.py" ]
CMD [ "python", "/var/pulsor/filter.py" ]