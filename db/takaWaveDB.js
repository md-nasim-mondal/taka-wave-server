import { MongoClient, ServerApiVersion } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.irefuhm.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

export const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

export const userCollection = client.db("takaWaveDB").collection("users");


export const connectDB = async () => {
    try {
        console.log("Successfully Connected to MongoDB!");
    } catch (error) {
        console.error("Failed to Connect to MongoDB", error);
    }
};