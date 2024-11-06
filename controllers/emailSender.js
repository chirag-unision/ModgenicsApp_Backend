const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_KEY);

exports.emailSender = async (email, otp) => {

    (async function () {
        const { data, error } = await resend.emails.send({
            from: 'GMT <gmt@mailings.ankn.dev>',
            to: [email],
            subject: 'OTP to Reset Password',
            html: `<strong>Your OTP is ${otp}</strong>`,
        });

        if (error) {
            console.error({ error });
        }
        console.log({ data });
    })();
}