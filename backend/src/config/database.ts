import mongoose from "mongoose";

const connectMongoose = async (): Promise<void> => {
  try {
    await mongoose.connect(process.env.MONGODB_URI as string);
    console.log("MongoDb connect on Atlas  ");
  } catch (error) {
    console.error(" MongoDB Connection Failed");

    if (error instanceof Error) {
      console.error(error.message);
    }
  }
};

export default connectMongoose;
