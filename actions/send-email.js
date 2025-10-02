import { MailerSend, EmailParams, Recipient } from 'mailersend';

const mailerSend = new MailerSend({
    apiKey: process.env.MAILERSEND_API_KEY,
});

export async function sendEmail({ to, subject, react }) {
    try {
        // Convert react (JSX/ReactNode) to HTML string if needed
        const html =
            typeof react === "string"
                ? react
                : (typeof window === "undefined" && require("react-dom/server").renderToStaticMarkup(react)) || "";

        const emailParams = new EmailParams()
            .setFrom(process.env.NEXT_PUBLIC_EMAIL_FROM, 'Welth')
            .setTo([new Recipient(to)])
            .setSubject(subject || 'No Subject')
            .setHtml(html);

        const response = await mailerSend.email.send(emailParams);
        return { success: true, data: response };
    } catch (error) {
        console.log('====================================');
        console.log("Failed to send Email: ", error.message);
        console.log('====================================');
        return { success: false, error };
    }
}