import mongoose,{Document,Schema} from "mongoose";

export interface IEventManagerDocument extends Document{


    userId :mongoose.Types.ObjectId,
    fullName:string,
    organizationName:string,
    aboutEvents:string,
    certificate:string,
    documentReference:string,
    experienceLevel:string,
    socialLinks:string,
    organizationType:string

}


const ManagerSchema = new Schema<IEventManagerDocument>({

     userId:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:true
     },
     fullName:{
        type:String,
        required:true,
     },
     organizationName:{
        type:String,
        required:true,
     },
     aboutEvents:{
        type:String,
        required:true,
     },
     certificate:{
        type:String,
        required:true,
     },
     documentReference:{
        type:String,
        required:true,
     },
     experienceLevel:{
        type:String,
        required:true,
     },
     socialLinks:{
        type:String,
        required:true,
     },
     organizationType:{
        type:String,
        required:true,
     },

},{timestamps:true})

export const EventManagerModel = mongoose.model<IEventManagerDocument>("EventManager",ManagerSchema)