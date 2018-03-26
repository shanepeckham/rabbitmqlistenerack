#
# ---- Base Node ----
FROM alpine:3.7 AS base
# install node
RUN apk add --no-cache nodejs nodejs-npm tini 
# set working directory
RUN mkdir -p /usr/src/hackeventlistener
WORKDIR /usr/src/hackeventlistener
# Set tini as entrypoint
ENTRYPOINT ["/sbin/tini", "--"]
# copy project file
COPY package.json .

#
# ---- Dependencies ----
FROM base AS dependencies
# install node packages
RUN npm set progress=false && npm config set depth 0
RUN npm install --only=production 
# copy production node_modules aside
RUN cp -R node_modules prod_node_modules
# install ALL node_modules, including 'devDependencies'
RUN npm install

#
# ---- Test ----
# run linters, setup and tests
FROM dependencies AS test
COPY . .
#RUN  npm run lint && npm run setup && npm run test
#RUN npm run setup && npm run test
#
# ---- Release ----
FROM base AS release
WORKDIR /usr/src/hackeventlistener
# copy production node_modules
COPY --from=dependencies /usr/src/hackeventlistener/prod_node_modules ./node_modules
# copy app sources
COPY . .
# expose port and define CMD

# EH
ENV RABBITMQHOST=
ENV PROCESSENDPOINT=
ENV TEAMNAME=
ENV PARTITIONKEY=

CMD [ "node", "hackeventlistener.js" ]