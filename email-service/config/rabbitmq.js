// email-service/config/rabbitmq.js
const amqp = require("amqplib");

const RABBITMQ_URL = process.env.RABBITMQ_URL;
const EXCHANGE_NAME = "orders_exchange";
const QUEUE_NAME = "orders_email_service_queue";
const QUEUE_BINDING_KEY = "orders.emailnotification";

let connection;
let channel;

async function connectRabbitMQ() {
  if (!connection) {
    try {
      connection = await amqp.connect(RABBITMQ_URL);
      channel = await connection.createChannel();

      // Define the exchange and queue
      await channel.assertExchange(EXCHANGE_NAME, "direct", { durable: true });
      await channel.assertQueue(QUEUE_NAME, { durable: true });
      await channel.bindQueue(QUEUE_NAME, EXCHANGE_NAME, QUEUE_BINDING_KEY);

      console.log(
        `Queue "${QUEUE_NAME}" bound to exchange "${EXCHANGE_NAME}" with key "${QUEUE_BINDING_KEY}"`
      );
    } catch (error) {
      console.error("Error connecting to RabbitMQ:", error);
      throw new Error("Failed to connect to RabbitMQ");
    }
  }
  return channel;
}

module.exports = {
  connectRabbitMQ,
  QUEUE_NAME,
};
