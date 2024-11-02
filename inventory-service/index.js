require("dotenv").config();
const express = require("express");
const { connectRabbitMQ, QUEUE_NAME } = require("./config/rabbitmq");

const app = express();
let inventory = {
  Laptop: { category: "Electronics", stock: 10 },
  Phone: { category: "Electronics", stock: 20 },
};

(async () => {
  const channel = await connectRabbitMQ();

  // Consume messages from the inventory update queue
  channel.consume(QUEUE_NAME, (msg) => {
    if (msg !== null) {
      const order = JSON.parse(msg.content.toString());
      const { itemName } = order.order;

      console.log(`Received order for inventory update:`, order.order);

      // Update the inventory
      if (inventory[itemName] && inventory[itemName].stock > 0) {
        inventory[itemName].stock -= 1;
        console.log(
          `Inventory updated: ${itemName} stock is now ${inventory[itemName].stock}`
        );
      } else {
        console.log(
          `Item ${itemName} is out of stock or does not exist in inventory`
        );
      }

      // Acknowledge message
      channel.ack(msg);
    }
  });

  app.listen(3001, () => console.log("Inventory Service running on port 3001"));
})();
