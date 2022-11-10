FROM alpine
RUN apk add --no-cache bash
RUN apk update
RUN apk upgrade
RUN apk add --update python3
# COPY /src/pulsor /pulsor
# CMD tail -f /dev/null
CMD [ "bash", "/var/pulsor/pulsor.sh" ]
