// notificationUtility.ts

import nodemailer from 'nodemailer';


export async function sendNotificationByEmail(email: string, subject: string, message: string): Promise<void> {
    try {
        const emailAddress = process.env.emailAddress;
        const emailpassword = process.env.emailpassword;

        const transporter = nodemailer.createTransport({
            host: 'https://ndevu12.github.io/My-BRAND/',
            port: 587,
            secure: false,
            auth: {
                user: emailAddress,
                pass: emailpassword,
            },
        });

        await transporter.sendMail({
            from: '"Ndevu" <emailAddress>',
            to: email,
            subject,
            text: message,
        });

        console.log('Notification sent successfully to:', email);
    } catch (error) {
        console.error('Error sending notification:', error);
        throw new Error('Failed to send notification');
    }
}
