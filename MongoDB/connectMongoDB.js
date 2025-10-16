const mongoose = require('mongoose');

const connectMongoDB = async () => {
    await mongoose.connect(process.env.Mongo_URL).then((response)=>{
        console.log("MongoDB connected successfully");
    }).catch((error)=>{
        console.log("Error in connecting to MongoDB", error);
    });
}

module.exports = connectMongoDB;