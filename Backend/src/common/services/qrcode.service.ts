import QRCode from 'qrcode';

import type { IQrCodeService } from '../interfaces/qr.interface';
export class QrCode implements IQrCodeService {
  async execute(data: string): Promise<string> {
    try {
      const qrCode = await QRCode.toDataURL(data);
      return qrCode;
    } catch {
      throw new Error('Failed to generate QR code');
    }
  }
}
