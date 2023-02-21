const mongoose = require('mongoose');
const mogoURI = "mongodb://localhost:27017/iNotebook";

const connectToMongo = () => {

    mongoose.connect(mogoURI, ()=>{
        console.log("connected to mongo successfully");
    })

}

module.exports = connectToMongo;