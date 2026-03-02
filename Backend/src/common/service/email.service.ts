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

    // async sendOtpEmail(to:string,otp:string):Promise<Void>{
    //     await this.transporter.sendMail({
    //         from `"Occasio"<${process.env.MAIL_USER}>`,
    //         to,
    //         subject:"Your otp code",
    //         html:`
    //         <h2>Verify Your Acoount</h2>
    //         <p>Your OTP is:</p>
    //         <h1>${otp}</h1>
    //         <p>This OTP expires in 5 minitues.</p>
    //         `
    //     });
    // }
     async sendOtpEmail(to: string, otp: string): Promise<void> {
        console.log("evdem ethyyyy")
        console.log(process.env.MAIL_PASS   ,  process.env.MAIL_USER)
    const value = await this.transporter.sendMail({
      
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
     console.log("for the checking",value)
  }
 
}