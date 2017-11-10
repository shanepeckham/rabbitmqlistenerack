#!/usr/bin/env node
'use strict';

let appInsights = require('applicationinsights');
var request = require('request');

var amqp = require('amqplib/callback_api');


// Start
var source = process.env.SOURCE;
var partitionKey = process.env.PARTITIONKEY;
var connectionString = process.env.RABBITMQURL;
var processendpoint = process.env.PROCESSENDPOINT;
var insightsKey = process.env.INSIGHTSKEY;

if (partitionKey == "")
{
    partitionKey = 0;
}

amqp.connect('amqp://' + connectionString, function (err, conn) {
    conn.createChannel(function (err, ch) {
        var q = 'order'+partitionKey;

        ch.assertQueue(q, { durable: false });
        console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", q);
        ch.consume(q, function (msg) {
            console.log(" [x] Received %s", msg.content.toString());

            var jj = msg.content.toString()
            /* let bufferOriginal = Buffer.from(JSON.parse(jj).data);
            console.log(bufferOriginal.toString('utf8'));
            var jstring = bufferOriginal.toString('utf8');  */

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
                    appclient.trackEvent("Event Order " + source + ": " + orderId);
                }
            }

            catch (e) {
                console.error("AppInsights " + e.message);
            }



        }, { noAck: true });
    });
});