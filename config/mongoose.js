const mongoose = require('mongoose');
mongoose.connect("mongodb://127.0.0.1/Task-1");

const db = mongoose.connection;

db.once('open', (err)=>{
    if(err) console.log(err);

    console.log("DB is connected");
})