


import { EventType } from "../../../../common/enums/event-type.js";
import { EventStatus } from "../../../../common/enums/event-status.js";
export class Events {
    constructor(
        public readonly id: string | null,

        public title: string,
        public description: string,
        public eventType: EventType,

        public startTime: Date,
        public endTime: Date,

        public location: {
            type: "Point";
            coordinates: [number, number];
            address: string;
        } | undefined,

        public maxOnlineUsers: number | undefined,
        public price: number,

        public createdBy: string,
        public status: EventStatus,
        public picture:string,
        public creatorDetails?: any
    ) {
        this.validate();
    }
    private validate() {
        if (this.eventType === EventType.ONLINE && this.location) {
            throw new Error("Online event should not have location");
        }

        if (this.eventType === EventType.OFFLINE && !this.location) {
            throw new Error("Offline event must have location");
        }

        if (this.eventType === EventType.ONLINE && !this.maxOnlineUsers) {
            throw new Error("Online event must have maxOnlineUsers");
        }
        if(this.eventType === EventType.HYBRID && (!this.location || !this.maxOnlineUsers)){
            throw new Error("Location + maxOnlineUsers required")
        }
    }
}