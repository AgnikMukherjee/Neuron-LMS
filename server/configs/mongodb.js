import mongoose from "mongoose";

const connectDB = async () => {
    try {
        mongoose.connection.on('connected', () => {
            console.log('Database connected');
        });
        await mongoose.connect(`${process.env.MONGODB_URI}/neuron-lms`);
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
};

export default connectDB;