import  mongoose,{Schema,Document} from "mongoose";
import { EventStatus } from "../../../../common/enums/eventstatus-enum";
import { SeatStatus } from "../../../../common/enums/searstatus-enum";
export interface ISeat extends Document{
    eventId:Schema.Types.ObjectId;
    layoutId:Schema.Types.ObjectId;
    block:string;
    row:number;
    column:number;
    seatNumber:string;

    categoryName:string;
    price:number;

    status:SeatStatus;
    holdExpiresAt?:Date;
}

const SeatSchema = new Schema<ISeat>({
    eventId:{type:Schema.Types.ObjectId, ref:"Event"},
    layoutId:{type:Schema.Types.ObjectId, ref:"SeatLayout"},

    block:String,
    row:Number,
    column:Number,
    price:Number,
    seatNumber:{type:String,required:true},
    categoryName:String,
    status:{
        type:String,
        enum:Object.values(SeatStatus),
        default:SeatStatus.AVAILABLE
    },
    holdExpiresAt:Date
},{timestamps:true});

SeatSchema.index({eventId:1,seatNumber:1},{unique:true})
export const SeatModel = mongoose.model("Seat",SeatSchema)