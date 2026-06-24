import { IQrCodeService } from "../interfaces/qr.interface";
import QRCode  from "qrcode";
export class QrCode implements IQrCodeService{

    async execute(data: string): Promise<string> {
         try {
      const qrCode = await QRCode.toDataURL(data)
      return qrCode;
    } catch (error) {
      throw new Error('Failed to generate QR code');
    }
    }

}