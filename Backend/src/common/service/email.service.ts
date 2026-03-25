import nodemailer from 'nodemailer';

export class EmailSerive {
    private transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASS
        }
    });

    constructor() {
        // Verify connection on startup
        this.transporter.verify((error, success) => {
            if (error) {
                console.error("Email transporter verification failed:", error);
            } else {
                console.log("Email transporter is ready to send messages");
            }
        });
    }

    async sendOtpEmail(to: string, otp: string): Promise<void> {
        try {
            console.log(`Sending OTP to ${to}...`);
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
            console.log(`OTP successfully sent to ${to}`);
        } catch (error) {
            console.error(`Failed to send OTP to ${to}:`, error);
        }
    }

    async sendApprovalEmail(to: string, name: string): Promise<void> {
        try {
            console.log(`Sending approval email to ${to}...`);
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
            console.log(`Approval email successfully sent to ${to}`);
        } catch (error) {
            console.error(`Failed to send approval email to ${to}:`, error);
        }
    }

    async sendRejectionEmail(to: string, name: string, reason?: string): Promise<void> {
        try {
            console.log(`Sending rejection email to ${to}...`);
            await this.transporter.sendMail({
                from: `"Occasio" <${process.env.MAIL_USER}>`,
                to,
                subject: "Event Manager Application Update",
                html: `
                    <h2>Hello ${name},</h2>
                    <p>Thank you for your interest in becoming an Event Manager on Occasio.</p>
                    <p>After reviewing your application, we regret to inform you that we cannot approve your request at this time.</p>
                    ${reason ? `<div style="background-color: #fff5f5; border-left: 4px solid #f56565; padding: 15px; margin: 20px 0;">
                        <strong>Reason for Rejection:</strong><br/>
                        ${reason}
                    </div>` : ""}
                    <p>If you have any questions, please feel free to contact our support team.</p>
                    <p>Best regards,<br/>The Occasio Team</p>
                `
            });
            console.log(`Rejection email successfully sent to ${to}`);
        } catch (error) {
            console.error(`Failed to send rejection email to ${to}:`, error);
        }
    }
}