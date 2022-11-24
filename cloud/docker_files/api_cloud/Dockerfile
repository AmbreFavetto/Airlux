FROM node:alpine

WORKDIR /usr/app

RUN npm install express
RUN npm install ip
RUN npm install dotenv
RUN npm install cors
RUN npm install pino
RUN npm install pino-pretty
CMD tail -f /dev/null
#CMD ["npm", "run", "airlux-cloud-db"]
ENTRYPOINT ["npm" , "run", "airlux-cloud-db"]
