import nodemailer from 'nodemailer';

export class EmailSerive{
    
    private transporter = nodemailer.createTransport({

      host:"smtp.gmail.com",
        port:587,
        secure:false,

        auth:{
            
            user:process.env.MAIL_USER,
            pass:process.env.MAIL_PASS
        }
        
    });

    
     async sendOtpEmail(to: string, otp: string): Promise<void> {
        // console.log("evdem ethyyyy")
        console.log(process.env.MAIL_PASS   ,  process.env.MAIL_USER)
     await this.transporter.sendMail({
      
      from: `"Occasio" <${process.env.MAIL_USER}>`,
      to,
      subject: "Your OTP Code",
      html: `
        <h2>Verify Your Account</h2>
        <p>Your OTP is:</p>
        <h1>${otp}</h1>
        <p>This OTP expires in 5 minutes.</p>
      `
    });
    //  console.log("for the checking",value)
  }
 
  async sendApprovalEmail(to: string, name: string): Promise<void> {
    await this.transporter.sendMail({
      from: `"Occasio" <${process.env.MAIL_USER}>`,
      to,
      subject: "Event Manager Application Approved",
      html: `
        <h2>Congratulations ${name}!</h2>
        <p>Your application to become an Event Manager on Occasio has been approved.</p>
        <p>You can now log in and start creating events.</p>
        <p>Best regards,<br/>The Occasio Team</p>
      `
    });
  }

  async sendRejectionEmail(to: string, name: string): Promise<void> {
    await this.transporter.sendMail({
      from: `"Occasio" <${process.env.MAIL_USER}>`,
      to,
      subject: "Event Manager Application Update",
      html: `
        <h2>Hello ${name},</h2>
        <p>Thank you for your interest in becoming an Event Manager on Occasio.</p>
        <p>After reviewing your application, we regret to inform you that we cannot approve your request at this time.</p>
        <p>If you have any questions, please feel free to contact our support team.</p>
        <p>Best regards,<br/>The Occasio Team</p>
      `
    });
  }
}