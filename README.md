# MongoDB Configuration and Model Setup

This guide explains how to configure MongoDB for your project and define a model using Mongoose.

---

## 1. Configuration of MongoDB

Follow these steps to configure MongoDB:

### Create and Set Up MongoDB Atlas
1. **Create an Account**: Sign up at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. **Create a Cluster**: Set up a new cluster.
3. **Get Connection String**:
   - Navigate to your cluster in the MongoDB Atlas dashboard.
   - Click on **Connect** and copy the connection string.
4. **Store the Connection String**:
   - Paste the connection string into your `.env` file for secure storage.

### Install MongoDB Compass
1. **Download MongoDB Compass**: [Download here](https://www.mongodb.com/products/compass).
2. **Connect to Your Cluster**:
   - Open MongoDB Compass.
   - Enter your connection string to connect to the MongoDB Atlas cluster.

### Install Mongoose
1. Install the Mongoose package by running the following command:
   ```bash
   npm install mongoose


### Aditional Notes:
    - Always connect your database before starting your server to avoid runtime errors.
