import type { ExperienceLevel } from '../../common/enums/experience-level.enum';
import type { OrganizationType } from '../../common/enums/organization-type.enum';

export interface UpgraderoleDto {
  email: string;
  fullName: string;
  organizationName: string;
  aboutEvents: string;
  certificate: string;
  documentReference: string;
  experienceLevel: ExperienceLevel;
  socialLinks: string;
  organizationType: OrganizationType;
}
