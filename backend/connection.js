const mongoose = require('mongoose');

const url = "mongodb+srv://avijeet7505:anish@cluster0.hwv9idx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"



//asynchronous function
mongoose.connect(url)
    .then((result) => {
        console.log('connected to db');
    }).catch((err) => {
        console.log(err);
    });

module.exports = mongoose;