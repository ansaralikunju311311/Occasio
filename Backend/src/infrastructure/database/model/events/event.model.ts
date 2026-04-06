import { Document, Schema, model } from "mongoose";
import { EventType } from "../../../../common/enums/event-type";
import { EventStatus } from "../../../../common/enums/eventstatus-enum";


export interface IEventDocument extends Document {
    title: string;
    description: string;
    eventType: EventType;
    startTime: Date;
    endTime: Date;

    location: {
        type: "Point";
        coordinates: [number, number]; 
        address: string;
    };

    maxOnlineUsers: number;
    price: number;

    createdBy: Schema.Types.ObjectId;
    status: EventStatus;
    picture:string,
    seatLayoutId:Schema.Types.ObjectId
}

const eventSchema = new Schema<IEventDocument>(
    {
        title: {
            type: String,
            required: true,
        },

        description: {
            type: String,
        },

        eventType: {
            type: String,
            enum: Object.values(EventType),
            required: true,
        },

        startTime: {
            type: Date,
            required: true,
        },

        endTime: {
            type: Date,
            required: true,
        },

        location: {
            type: {
                type: String,
                enum: ["Point"],
                required: false,
            },
            coordinates: {
                type: [Number],
                required: false,
            },
            address: {
                type: String,
            },
        },

        maxOnlineUsers: Number,
        price: Number,

        createdBy: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        status: {
            type: String,
            enum: Object.values(EventStatus),
            default: EventStatus.ACTIVE,
        },
        picture:{
            type:String,
            required: true
        },
        seatLayoutId: {
  type: Schema.Types.ObjectId,
  ref: "SeatLayout",
  required: false
}
    },
    { timestamps: true }
);
 eventSchema.virtual("seats", {
   ref: "Seat",
   localField: "_id",
  foreignField: "eventId",
 });



eventSchema.set("toObject", { virtuals: true });
 eventSchema.set("toJSON", { virtuals: true });

eventSchema.index({ location: "2dsphere" });

export const EventModel = model<IEventDocument>("Event", eventSchema);