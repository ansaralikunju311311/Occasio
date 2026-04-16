export interface ManagerResponseDto {
  id: string;
  userId: string;
  fullName: string;
  organizationName: string;
  aboutEvents: string;
  certificate: string;
  documentReference: string;
  experienceLevel: string;
  socialLinks: string;
  organizationType: string;
  createdAt?: Date;
  updatedAt?: Date;
}
