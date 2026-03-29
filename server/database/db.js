import mongoose from "mongoose";

export const connectDB = () => {
    mongoose.connect(process.env.MONGODB_URI, {
        dbName: "Library_Management_System"
    }).then(() => {
        console.log("Database connected");
    }).catch((error) => {
        console.log("error", error);
    })
}