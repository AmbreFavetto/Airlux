FROM node:alpine

WORKDIR /usr/app
COPY ../src/api_cloud/package.json ./
RUN npm install --quiet
COPY . .

#CMD ["npm", "test"]
ENTRYPOINT ["tail", "-f", "/dev/null"]
