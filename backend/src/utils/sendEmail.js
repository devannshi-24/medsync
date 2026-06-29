import nodemailer from "nodemailer"



export const sendOTPEmail = async (email, otp) => {

  

    const transporter = nodemailer.createTransport({
    service:"gmail",
    auth:{
        user:process.env.EMAIL_USER,
        pass:process.env.EMAIL_PASS
     }
    })


    await transporter.sendMail({
        from: process.env.EMAIL_USER,
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

