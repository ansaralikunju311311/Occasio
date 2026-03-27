import { Document, Schema, model } from "mongoose";
import { EventType } from "../../../../common/enums/event-type.js";
import { EventStatus } from "../../../../common/enums/event-status.js";
import { truncate } from "node:fs";

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
    picture:string
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

        location?: {
            type: {
                type: String,
                enum: ["Point"],
                required: true,
            },
            coordinates: {
                type: [Number],
                required: true,
            },
            address: {
                type: String,
            },
        },

        maxOnlineUsers?: Number,
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
            required:truncate
        }
    },
    { timestamps: true }
);

eventSchema.index({ location: "2dsphere" });

export const EventModel = model<IEventDocument>("Event", eventSchema);