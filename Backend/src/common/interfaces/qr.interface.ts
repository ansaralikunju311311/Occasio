export interface IQrCodeService {
  execute(data: string): Promise<string>;
}