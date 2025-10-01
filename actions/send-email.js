import { Resend } from "resend";

export async function sendEmail({to , subject , react}) {
    const resend = new Resend(process.env.RESEND_API_KEY);

    try {
        const data = await resend.emails.send({
            from: "Welth <alerts@dbs-financetracker.netlify.app>",
            to: [`${to}`],
            subject,
            react
        })

        return {success:true , data}
    } catch (error) {
        console.log('====================================');
        console.log("Failed to send Email: " , error.message);
        console.log('====================================');
        return {success:false , error}
    }
}