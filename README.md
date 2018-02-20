# RabbitMQ Listener - The Azure Kubernetes Challenge
A containerised nodejs event listener that listens to RabbitMQ and passes requests on to an internal endpoint

The following environment variables need to be passed to the container:

### ACK Logging
```
ENV TEAMNAME=[YourTeamName]
```
### For RabbitMQ
```
ENV RABBITMQHOST=amqp://[url]l:5672
ENV PARTITIONKEY=[0,1,2]
```
### For Process Endpoint
```
ENV PROCESSENDPOINT=http://fulfillorder.[namespace].svc.cluster.local:8080/v1/order/
```
