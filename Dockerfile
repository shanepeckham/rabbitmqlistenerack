FROM node:boron

# Create app directory
RUN mkdir -p /usr/src/hackeventlistener
WORKDIR /usr/src/hackeventlistener

ENV AMQPURL=
ENV PROCESSENDPOINT=
ENV TEAMNAME=

# Bundle app source
ADD / . 

# Install app dependencies
RUN npm install


CMD [ "node", "hackeventlistener.js" ]
