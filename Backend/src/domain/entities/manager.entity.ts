export class EventManager {
  constructor(
    public readonly id: string | null,
    public userId: string,
    public fullName: string,
    public organizationName: string,
    public aboutEvents: string,
    public certificate: string,
    public documentReference: string,
    public experienceLevel: string,
    public socialLinks: string,
    public organizationType: string,
  ) {}
}
