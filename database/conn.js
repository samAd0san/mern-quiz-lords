import mongoose from "mongoose";

/** Connect to the database */
export default async function connect() {
    try {
        mongoose.set('strictQuery', true); // Adjust based on your preference
        
        // Check the environment to determine the URI
        const dbURI = process.env.NODE_ENV === 'development' ? process.env.LOCAL_URI : process.env.ATLAS_URI;
        await mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log(`Database connected to ${dbURI}`);
    } catch (error) {
        console.error("Database connection error:", error);
        throw error; // Re-throw the error to handle it in the main file
    }
}
