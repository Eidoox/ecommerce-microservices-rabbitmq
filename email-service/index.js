require("dotenv").config();
const express = require("express");
const { connectRabbitMQ, QUEUE_NAME } = require("./config/rabbitmq");

const app = express();

(async () => {
  const channel = await connectRabbitMQ();

  // Consume messages from the email service queue
  channel.consume(QUEUE_NAME, (msg) => {
    if (msg !== null) {
      const order = JSON.parse(msg.content.toString());
      const { email, itemName, orderId } = order.order;

      console.log(
        `Sending email to ${email} for order ${orderId} - Item: ${itemName}`
      );

      // Here we can use Nodemailer and send emails to the user's email address

      // Acknowledge message after processing
      channel.ack(msg);
    }
  });

  app.listen(3003, () => console.log("Email Service running on port 3003"));
})();
