require("dotenv").config();
const express = require("express");
const { connectRabbitMQ, EXCHANGE_NAME } = require("./config/rabbitmq");
const app = express();
app.use(express.json());

(async () => {
  const channel = await connectRabbitMQ();

  // POST endpoint to create an order
  app.post("/order", async (req, res) => {
    const { email, itemName, itemCategory } = req.body;

    if (!email || !itemName || !itemCategory) {
      return res.status(400).json({ error: "Invalid order data" });
    }

    // Create the order object
    const order = {
      orderId: Date.now(), // Generate a unique order ID
      email,
      itemName,
      itemCategory,
      status: "completed",
    };

    try {
      // Publish message to email notification queue

      channel.publish(
        EXCHANGE_NAME,
        "orders.emailnotification",
        Buffer.from(
          JSON.stringify({
            message: "Order completed",
            order,
          })
        )
      );
      console.log("Order completion sent to email notification queue:", order);

      // Publish message to inventory update queue
      channel.publish(
        EXCHANGE_NAME,
        "orders.inventoryupdate",
        Buffer.from(
          JSON.stringify({
            message: "Order completed",
            order,
          })
        )
      );
      console.log("Order completion sent to inventory update queue:", order);

      res.status(201).json({ message: "Order created successfully", order });
    } catch (error) {
      console.error("Error publishing order completion message:", error);
      res.status(500).json({ error: "Failed to create order" });
    }
  });

  app.listen(3002, () => console.log("Order Service running on port 3002"));
})();
