import nodemailer from "nodemailer"



export const sendOTPEmail = async (email, otp) => {

  

const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

    await transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to: email,
        subject: "MedSync Email Verification",
        html: `
            <h2>Email Verification</h2>
            <p>Your OTP is:</p>
            <h1>${otp}</h1>
            <p>This OTP will expire in 5 minutes.</p>
        `
    });
};

