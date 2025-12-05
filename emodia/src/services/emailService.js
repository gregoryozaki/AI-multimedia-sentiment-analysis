import nodemailer from "nodemailer";

export const sendRecoveryEmail = async (to, token) => {
    const transporter = nodemailer.createTransport({
        host: process.env.MAIL_HOST,
        port: Number(process.env.MAIL_PORT),
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASS,
        },
    });

    const resetUrl = `${process.env.BASE_URL}/reset-password/${token}`;

    await transporter.sendMail({
        from: `"Emodia" <no-reply@emodia.com>`,
        to,
        subject: "Recuperação de Senha - Emodia",
        html: `
            <h2>Redefinir senha</h2>
            <p>Clique no botão abaixo para redefinir sua senha:</p>

            <a href="${resetUrl}"
               style="display:inline-block;padding:12px 20px;
               background:#6e00c8;color:white;border-radius:8px;
               text-decoration:none;font-weight:600;">
                Redefinir senha
            </a>

            <p>Se você não pediu isso, basta ignorar este e-mail.</p>
        `
    });

    console.log("📨 Email enviado com sucesso!");
};
