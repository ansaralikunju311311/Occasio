import mongoose from "mongoose";

export const connectDateBase = async ():Promise<void> =>{



    try {
        const uri = process.env.Mongo_URI as string
       await mongoose.connect(uri);
       console.log(`the mongo db is connected`)
    } catch (error) {
        console.log(error)
    }
       
}