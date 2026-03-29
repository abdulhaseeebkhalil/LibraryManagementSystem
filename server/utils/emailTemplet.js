export function getVerificationOTPEmailTemplate(otp) {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>BookWorm Library - Verify Your Email</title>
        <style>
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                background-color: #f4f7f6;
                margin: 0;
                padding: 0;
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100vh;
            }
            .container {
                background-color: #ffffff;
                padding: 40px;
                border-radius: 12px;
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
                max-width: 500px;
                width: 100%;
                text-align: center;
            }
            .logo {
                font-size: 32px;
                font-weight: 700;
                color: #2c3e50;
                margin-bottom: 20px;
            }
            .title {
                font-size: 24px;
                font-weight: 600;
                color: #2c3e50;
                margin-bottom: 10px;
            }
            .subtitle {
                color: #6c757d;
                margin-bottom: 30px;
                font-size: 16px;
            }
            .otp-box {
                background-color: #e8f5e9;
                border: 2px dashed #4caf50;
                padding: 30px;
                border-radius: 8px;
                margin: 20px 0;
                display: inline-block;
            }
            .otp-code {
                font-size: 48px;
                font-weight: 700;
                color: #2e7d32;
                letter-spacing: 8px;
                text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            }
            .info-text {
                color: #555;
                font-size: 14px;
                margin-bottom: 20px;
                line-height: 1.6;
            }
            .warning {
                background-color: #fff3e0;
                border-left: 4px solid #ff9800;
                padding: 15px;
                text-align: left;
                margin-bottom: 20px;
                border-radius: 4px;
            }
            .warning-text {
                color: #e65100;
                font-size: 14px;
                margin: 0;
                font-weight: 500;
            }
            .footer {
                margin-top: 30px;
                padding-top: 20px;
                border-top: 1px solid #e0e0e0;
                font-size: 12px;
                color: #9e9e9e;
            }
            .footer a {
                color: #4caf50;
                text-decoration: none;
                font-weight: 600;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="logo">📚 BookWorm</div>
            <div class="title">Verify Your Email Address</div>
            <div class="subtitle">Welcome to BookWorm Library Management System!</div>
            
            <div class="warning">
                <p class="warning-text">⚠️ This code will expire in 10 minutes</p>
            </div>
            
            <div class="info-text">
                Please use the following One-Time Password (OTP) to verify your email address and complete your registration.
            </div>
            
            <div class="otp-box">
                <div class="otp-code">${otp}</div>
            </div>
            
            <div class="info-text">
                If you did not initiate this registration, please ignore this email.
            </div>
            
            <div class="footer">
                <p>Thank you for choosing BookWorm!</p>
                <p>© ${new Date().getFullYear()} BookWorm Library Management System. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
    `;
}

export function generateResetPasswordEmailTemplate(resetPasswordUrl) {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">  
        <title>BookWorm Library - Reset Your Password</title>
        <style>
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                background-color: #f4f7f6;
                margin: 0;
                padding: 0;
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100vh;
            }
            .container {
                background-color: #ffffff;
                padding: 40px;
                border-radius: 12px;
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
                max-width: 500px;
                width: 100%;
                text-align: center;
            }
            .logo {
                font-size: 32px;
                font-weight: 700;
                color: #2c3e50;
                margin-bottom: 20px;
            }
            .title {
                font-size: 24px;
                font-weight: 600;
                color: #2c3e50;
                margin-bottom: 10px;
            }
            .subtitle {
                color: #6c757d;
                margin-bottom: 30px;
                font-size: 16px;
            }
            .reset-link {
                background-color: #28a745;
                color: #ffffff;
                padding: 15px 30px;
                border-radius: 8px;
                text-decoration: none;
                font-size: 18px;
                font-weight: 600;
                display: inline-block;
                margin: 20px 0;
                transition: background-color 0.3s ease;
            }
            .reset-link:hover {
                background-color: #218838;
            }
            .info-text {
                color: #555;
                font-size: 14px;
                margin-bottom: 20px;
                line-height: 1.6;
            }
            .warning {
                background-color: #fff3e0;
                border-left: 4px solid #ff9800;
                padding: 15px;
                text-align: left;
                margin-bottom: 20px;
                border-radius: 4px;
            }
            .warning-text {
                color: #e65100;
                font-size: 14px;
                margin: 0;
                font-weight: 500;
            }
            .footer {
                margin-top: 30px;
                padding-top: 20px;
                border-top: 1px solid #e0e0e0;
                font-size: 12px;
                color: #9e9e9e;
            }
            .footer a {
                color: #4caf50;
                text-decoration: none;
                font-weight: 600;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="logo">📚 BookWorm</div>
            <div class="title">Reset Your Password</div>
            <div class="subtitle">BookWorm Library Management System</div>
            
            <div class="warning">
                <p class="warning-text">⚠️ This link will expire in 10 minutes</p>
            </div>
            
            <div class="info-text">
                Click the button below to reset your password. If you did not request a password reset, please ignore this email.
            </div>
            
            <a href="${resetPasswordUrl}" class="reset-link">Reset Password</a>
            
            <div class="info-text">
                If you're having trouble clicking the button, copy and paste the following URL into your browser:
                <br>
                <a href="${resetPasswordUrl}" style="color: #28a745; text-decoration: none; word-break: break-all;">${resetPasswordUrl}</a>
            </div>
            
            <div class="footer">
                <p>Thank you for using BookWorm!</p>
                <p>© ${new Date().getFullYear()} BookWorm Library Management System. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
    `;
}