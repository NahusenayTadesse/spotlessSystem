import nodemailer from 'nodemailer';

import { HOST, USER, PASSWORD, PORT } from '$env/static/private';

export async function sendResetPasswordEmail(toEmail: string, newPassword: string) {
	// Create transporter
	const transporter = nodemailer.createTransport({
		host: HOST, // e.g smtp.gmail.com
		port: PORT, // e.g 465 or 587
		secure: true, // true for 465, false for 587
		auth: {
			user: USER, // sender email
			pass: PASSWORD // sender email password / app password
		},
		authMethod: 'PLAIN'
	});

	const mailOptions = {
		from: `"Support Team" <admin@sunamarketing.com>`,
		to: toEmail,
		subject: 'Password Reset',
		text: `Your password has been reset. Your new password is: ${newPassword}`,
		html: `
    <h3>Password Reset</h3>
    <p>Your password has been reset successfully.</p>
    <p><strong>New Password:</strong> ${newPassword}</p>
    <p>Please log in and change it immediately for security reasons.</p>
  `,
		envelope: {
			from: 'admin@sunamarketing.com', // <-- important
			to: toEmail
		}
	};

	await transporter.sendMail(mailOptions);

	return { success: true, message: 'Reset email sent successfully' };
}
