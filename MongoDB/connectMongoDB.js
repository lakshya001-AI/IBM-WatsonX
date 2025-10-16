const mongoose = require('mongoose');

const connectMongoDB = async () => {
    await mongoose.connect("mongodb+srv://makodelakshya101_db_user:n3rN1lvbI73upcbs@cluster0.txde5ek.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0").then((response)=>{
        console.log("MongoDB connected successfully");
    }).catch((error)=>{
        console.log("Error in connecting to MongoDB", error);
    });
}

module.exports = connectMongoDB;