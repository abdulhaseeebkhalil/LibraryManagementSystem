// import { getVerificationOTPEmailTemplate } from "./emailTemplet.js";
// import { sendEmail } from "./sendEmails.js";

// export async function sendVerificationCode(verificationCode, email, res) {
//   try {
//     const message = getVerificationOTPEmailTemplate(verificationCode);
//     sendEmail(
//       email,
//       (subject = "Verification Code (BookWorm Library Managment System)"),
//       message,
//       res,
//     );

//     res.status(200).json({
//       success: true,
//       message: "Verification code sent successfully",
//     });
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: "Failed to send verification code",
//       error: error.message,
//     });
//   }
// }


import { getVerificationOTPEmailTemplate } from "./emailTemplet.js";
import { sendEmail } from "./sendEmails.js";

export async function sendVerificationCode(verificationCode, email) {
  try {
    const message = getVerificationOTPEmailTemplate(verificationCode);
    await sendEmail(
      email,
      "Verification Code (BookWorm Library Management System)",
      message,
    );
  } catch (error) {
    console.error("Failed to send verification code", error);
    throw error;
  }
}