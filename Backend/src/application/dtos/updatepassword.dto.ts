export interface UpdatePasswordDto {
  email: string;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}
