const express = require('express');
const {adminAuth,userAuth} = require('./middlewares/auth');

const app = express();


app.use("/admin", adminAuth);

app.get('/admin/getAllData', (req,res) => {
    res.send("Admin Data!");
})

app.post('/user/login', (req,res) => {
    res.send("User is logged in successfully");
});

app.get('/user', userAuth, (req,res) => {
    res.send("User Data!");
})

app.get('/admin/deleteUser', (req,res) => {
    res.send("User Deleted!");
})

app.listen(7777, () => {
    console.log("Server is successfully running on port 7777....")
});