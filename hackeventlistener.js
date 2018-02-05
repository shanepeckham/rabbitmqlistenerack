#!/usr/bin/env node
'use strict';

let appInsights = require('applicationinsights');
var request = require('request');

var amqp = require('amqplib/callback_api');


// Start
var source = process.env.SOURCE;
var partitionKey = process.env.PARTITIONKEY.trim();
var connectionString = process.env.RABBITMQHOST;
var processendpoint = process.env.PROCESSENDPOINT;
var insightsKey = '23c6b1ec-ca92-4083-86b6-eba851af9032';
var teamname = process.env.TEAMNAME;


if (insightsKey != "") {
    appInsights.setup(insightsKey).start();
  }


if (partitionKey == "")
{
    partitionKey = 0;
}

console.log("Connecting to Rabbit instance " + connectionString);

amqp.connect(connectionString , function (err, conn) {

    conn.createChannel(function (err, ch) {
        var q = 'order';

        ch.assertQueue(q, { durable: false });
        console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", q);
        ch.consume(q, function (msg) {
            console.log(" [x] Received %s", msg.content.toString());

            var jj = msg.content.toString()

            var orderId = jj.substring(10, 34);
            console.log("order " + orderId)

            // Set the headers
            var headers = {
                'Content-Type': 'application/json'
            };

            if (processendpoint != "") {
                // Configure the request
                var options = {
                    url: processendpoint,
                    method: 'POST',
                    headers: headers,
                    json: { 'ID': orderId }
                };

                // Start the request
                try {
                    request(options, function () {
                    });
                }
                catch (e) {
                    session.send('error!: ' + e.message);
                }
            } // we have a process endpoint

            try {

                if (insightsKey != "") {
                    let appclient = appInsights.defaultClient;
                    appclient.trackEvent("RabbitMQListener:v4 " + teamname );
                }
            }

            catch (e) {
                console.error("AppInsights " + e.message);
            }

        }, { noAck: true });
    });
});