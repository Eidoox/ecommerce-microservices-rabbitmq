## Simple E-commerce Microservices System
### This is a simple simulation of an e-commerce system using microservices architecture with asynchronous communication via RabbitMQ. Includes services for Order Processing, Inventory Management, and Email Notifications, all communicating asynchronously to ensure efficient and decoupled operations.


## Technologies Used

- Node.js: Handles the core logic for each microservice.
- Express.js: Provides a lightweight framework for building RESTful APIs within each service.
- RabbitMQ: Manages asynchronous communication between services, ensuring efficient, event-driven interactions.
- Docker: Containerizes each service for consistent deployment and easy scalability.


## Workflow of the Application

This application consists of three microservices that communicate asynchronously using RabbitMQ to ensure efficient and decoupled operations. The services are:

- Order Service: Manages incoming customer orders.
- Inventory Service: Manages stock levels for each product.
- Email Service: Handles customer notifications through email.

### RabbitMQ Communication Setup
To enable seamless, asynchronous communication between services, the application uses RabbitMQ with the following setup:

1. Exchange:
   - Type: direct
   - Purpose: Routes messages based on specific routing keys, allowing each service to subscribe to the messages relevant to its role.
2. Queues and Binding Keys:
   - Inventory Queue (orders_inventory_update_queue):
     - Binding Key: orders.inventoryupdate
     - Used by the Inventory Service to receive new order notifications and update stock.
   - Email Queue (orders_email_service_queue):
     - Binding Key: orders.emailnotification
     - Used by the Email Service to send order confirmation and inventory update emails.


### Services Breakdown

1. Order Service:

   - Receives a new order through a POST request to the /order endpoint.
   - Once the order is successfully created, it publishes a message to the orders_exchange with the routing keys orders.inventoryupdate and orders.emailnotification, notifying both the Inventory and Email services.
  
2. Inventory Service:

   - Listens for messages on the orders_inventory_update_queue with the binding key orders.inventoryupdate.
   - When a new order message arrives, the Inventory Service processes it by adjusting the stock levels for the ordered items.
   - After updating stock, it may publish an inventory.updated message to further notify other interested services (if needed).
  
3. Email Service:

   - Listens for messages on the orders_email_service_queue with the binding key orders.emailnotification.
   - When it receives an order notification, it sends an order confirmation email to the customer.

###  Summary of Communication Flow
- Order Service initiates the order by sending messages to both Inventory and Email services.
- Inventory Service adjusts stock based on the order and can trigger further notifications if needed.
- Email Service sends confirmation emails based on order creation and inventory updates, keeping both customers and stakeholders informed.

This setup enables loose coupling between services, allowing each to operate independently while maintaining coordination through RabbitMQ's messaging system.
