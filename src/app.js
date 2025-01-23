const express = require('express');
const {adminAuth} = require('./middlewares/auth');

const app = express();


// app.use("/admin", adminAuth);

app.get('/admin/getAllData',adminAuth, (req,res) => {
    res.send("Admin Data!");
})

app.get('/user', (req,res) => {
    res.send("User Data!");
})

app.get('/admin/deleteUser', adminAuth, (req,res) => {
    res.send("User Deleted!");
})

app.listen(7777, () => {
    console.log("Server is successfully running on port 7777....")
});