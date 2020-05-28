import mongoose from "mongoose"

import dotenv from "dotenv"

dotenv.config()


const mongooseConnection = ()=>{
    mongoose.connect(process.env.MONGOOSE_URL, {
        useNewUrlParser: true,
            useFindAndModify: false,
            useCreateIndex: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 5000
    })
    .then(
        () => {
            console.log("Connected to MongoDB!");
        },
        err => {
            console.log(err.reason);
        }
    );
}

export default mongooseConnection
