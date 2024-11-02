const amqp = require("amqplib");
const RABBITMQ_URL = process.env.RABBITMQ_URL;
const EXCHANGE_NAME = "orders_exchange";
const EXCHANGE_TYPE = "direct";
const EXCHANGE_OPTIONS = { durable: true };

const QUEUE1_NAME = "orders_inventory_update_queue";
const QUEUE2_NAME = "orders_email_service_queue";
const QUEUE1_BINDING_KEY = "orders.inventoryupdate";
const QUEUE2_BINDING_KEY = "orders.emailnotification";

let connection;
let channel;

async function connectRabbitMQ() {
  if (!connection) {
    try {
      connection = await amqp.connect(RABBITMQ_URL);
      channel = await connection.createChannel();

      // Define the exchange
      await channel.assertExchange(
        EXCHANGE_NAME,
        EXCHANGE_TYPE,
        EXCHANGE_OPTIONS
      );
      console.log(
        `Exchange "${EXCHANGE_NAME}" of type "${EXCHANGE_TYPE}" created.`
      );

      // Define Queue 1 and bind it to the exchange with QUEUE1_BINDING_KEY
      await channel.assertQueue(QUEUE1_NAME, { durable: true });
      await channel.bindQueue(QUEUE1_NAME, EXCHANGE_NAME, QUEUE1_BINDING_KEY);
      console.log(
        `Queue "${QUEUE1_NAME}" bound to exchange "${EXCHANGE_NAME}" with binding key "${QUEUE1_BINDING_KEY}".`
      );

      // Define Queue 2 and bind it to the exchange with QUEUE2_BINDING_KEY
      await channel.assertQueue(QUEUE2_NAME, { durable: true });
      await channel.bindQueue(QUEUE2_NAME, EXCHANGE_NAME, QUEUE2_BINDING_KEY);
      console.log(
        `Queue "${QUEUE2_NAME}" bound to exchange "${EXCHANGE_NAME}" with binding key "${QUEUE2_BINDING_KEY}".`
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
  EXCHANGE_NAME,
  QUEUE1_NAME,
  QUEUE2_NAME,
};
