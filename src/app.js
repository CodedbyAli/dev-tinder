const express = require('express');
const connectDB = require('./config/database');
const cookieParser = require('cookie-parser');
const app = express();

app.use(express.json());
app.use(cookieParser())

const authRouter = require('./routes/auth')
const profileRouter = require('./routes/profile')
const connectionRouter = require('./routes/connection');

app.use('/', authRouter);
app.use('/', profileRouter);
app.use('/', connectionRouter);

connectDB()
 .then(() => {

   console.log("Database connection established successfully")   

    app.listen(7777, () => {
        console.log("Server is successfully running on port 7777....")
    });

 }).catch((err) => {
    console.error("Error occurred while connecting to the database"); 
  })
