FROM node:10-alpine
WORKDIR /usr/src/app
#COPY package*.json server.js ./
COPY server.js ./

RUN npm init
RUN npm install
RUN npm install smpp
RUN npm install pm2 -g
CMD ["pm2-runtime", "server.js"]
