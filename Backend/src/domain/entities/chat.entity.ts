export class ChatMessage {
  constructor(
    public readonly id: string | null,
    public readonly eventId: string,
    public readonly senderId: string,
    public readonly senderName: string,
    public readonly senderRole: string,
    public readonly message: string,
    public readonly createdAt: Date = new Date(),
  ) {
    this.validate();
  }

  private validate(): void {
    if (!this.eventId) {
      throw new Error('Event ID is required for chat message');
    }
    if (!this.senderId) {
      throw new Error('Sender ID is required for chat message');
    }
    if (!this.message || this.message.trim().length === 0) {
      throw new Error('Message content cannot be empty');
    }
  }
}
