const mongoose = require("mongoose");

const connectDb = async (MONGO_URL) => {
    try {
        await mongoose.connect(process.env.MONGODB_URI)
        console.log("mongo Db is connected")
    }
    catch (error) {
        console.error(error);
        process.exist(1)
    }
}

module.exports = connectDb;