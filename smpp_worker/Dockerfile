#FROM node:10
FROM node:17-alpine
WORKDIR /usr/src/app
COPY package*.json ecosystem.config.js client2.js ./

#RUN apk add g++ make python
RUN npm install
#RUN npm install smpp
#RUN npm install amqplib
RUN npm install pm2 -g
#RUN npm install pm2 
#EXPOSE 2775
#CMD ["node", "server.js"]
#CMD ["pm2", "start", "server.js"]
#CMD ["pm2-runtime", "client2.js"]
CMD ["pm2-runtime", "ecosystem.config.js"]
