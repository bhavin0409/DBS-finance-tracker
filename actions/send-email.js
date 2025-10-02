import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail({ to, subject, react }) {
    try {
        const data = await resend.emails.send({
            from: 'dbs-financetracker.netlify.app@resend.dev',
            to,
            subject,
            react,
        });
        return { success: true, data };
    } catch (error) {
        console.log('Failed to send Email:', error);
        return { success: false, error };
    }
}