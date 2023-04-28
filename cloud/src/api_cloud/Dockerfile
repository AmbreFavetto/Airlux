FROM node:alpine as builder

WORKDIR /usr/app
COPY ./package*.json ./
RUN npm ci

COPY . .
RUN npm run build
RUN rm -rf ./node_modules
RUN npm ci --omit=dev

FROM node:alpine as run 

WORKDIR /usr/app
COPY --from=builder /usr/app/dist /usr/app/dist
COPY --from=builder /usr/app/package.json /usr/app/package.json
COPY --from=builder /usr/app/node_modules /usr/app/node_modules

CMD ["npm", "start"]
# ENTRYPOINT ["tail", "-f", "/dev/null"]
