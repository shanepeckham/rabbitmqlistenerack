FROM node:boron

# Create app directory
RUN mkdir -p /usr/src/hackeventlistener
WORKDIR /usr/src/hackeventlistener

ENV INSIGHTSKEY=
ENV SOURCE=
ENV PROCESSENDPOINT=
ENV PARTITIONKEY=
ENV RABBITMQURL=


# Install app dependencies
RUN npm install

# Bundle app source
ADD / . 

CMD [ "node", "eventlistener.js" ]