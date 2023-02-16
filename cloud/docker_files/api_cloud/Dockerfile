FROM node:alpine

WORKDIR /usr/app

RUN npm install express
RUN npm install ip
RUN npm install dotenv
RUN npm install cors
RUN npm install pino
RUN npm install mysql
RUN npm install pino-pretty
RUN npm install socket.io
RUN npm install ws
#CMD tail -f /dev/null
CMD ["npm", "run", "start:prod"]
#ENTRYPOINT ["npm" , "run", "airlux-cloud-db"]
