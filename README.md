# Supporta Backend Task

## Project Summary,
This project is a Node.js, Express, and MongoDB-based backend system designed for a product management platform with JWT-based user authentication and a dynamic product viewing system.

Key Features Implemented:
User Authentication:
Secure registration and login with JWT (access + refresh tokens).
Middleware protection for all private routes.

Product Management:
Users can add products with name, brand, category, price, and image.

API to view all products, with:
Filtering by brand and category.
 Sorting by price or product name (ascending/descending).

Blocking System Logic:
Implemented a logic where a user cannot view products of users who have blocked them.
MongoDB query efficiently filters these users.

Personal Product Listing:
Endpoint to fetch only the logged-in user’s products.

API Testing & Security:
All endpoints are tested in Postman.
proper error handling and response status codes added for robustness.

Tech Stack:
Node.js & Express.js
MongoDB Atlas with Mongoose
JWT Authentication
Postman for API testing

## How to Run

1. Clone the repo:
   ```bash
   git clone https://github.com/Aneesh-o/-Supporta-machine-test


