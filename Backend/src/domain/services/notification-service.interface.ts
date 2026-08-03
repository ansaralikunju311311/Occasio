export interface INotificationService {
  notifyUser(userId: string, eventName: string, data: unknown): void;
  broadcast(eventName: string, data: unknown): void;
  toRoomEmit(room: string, eventName: string, data: unknown): void;
}
