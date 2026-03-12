import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { sendRecoveryEmail } from "../services/emailService.js";

/* ============================================================
   REGISTRAR USUÁRIO
============================================================ */
export const registerUser = async (req, res) => {
    try {
        const { name, birthday, email, password, confirmPassword } = req.body;

        if (!name || !birthday || !email || !password)
            return res.render("signup", { error: "Preencha todos os campos!" });

        const birth = new Date(birthday);
        const now = new Date();
        let age = now.getFullYear() - birth.getFullYear();
        const m = now.getMonth() - birth.getMonth();
        if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) age--;

        if (age < 18)
            return res.render("signup", { error: "Você precisa ter 18 anos ou mais." });

        if (password !== confirmPassword)
            return res.render("signup", { error: "As senhas não coincidem." });

        if (password.length < 8)
            return res.render("signup", { error: "A senha precisa ter pelo menos 8 caracteres." });

        const exists = await User.findByEmail(email);
        if (exists)
            return res.render("signup", { error: "E-mail já cadastrado!" });

        const hashedPassword = await bcrypt.hash(password, 10);

        await User.create({
            name,
            birthday,
            email,
            password: hashedPassword
        });

        return res.redirect("/login");

    } catch (err) {
        console.error(err);
        return res.render("signup", { error: "Erro ao criar conta." });
    }
};



/* ============================================================
   LOGIN
============================================================ */
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password)
            return res.render("login", { error: "Preencha todos os campos!" });

        const user = await User.findByEmail(email);
        if (!user)
            return res.render("login", { error: "E-mail não encontrado." });

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch)
            return res.render("login", { error: "Senha incorreta!" });

        req.session.user = {
            id: user.id,
            name: user.name,
            email: user.email
        };

        return res.redirect("/dashboard");

    } catch (err) {
        console.error("❌ Erro no login:", err);
        return res.render("login", { error: "Erro ao fazer login." });
    }
};



/* ============================================================
   LOGOUT
============================================================ */
export const logoutUser = (req, res) => {
    req.session.destroy(() => {
        res.redirect("/login");
    });
};



/* ============================================================
   ESQUECI A SENHA
============================================================ */
export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        const user = await User.findByEmail(email);
        if (!user)
            return res.render("forgot-password", { error: "E-mail não encontrado." });

        const token = crypto.randomBytes(32).toString("hex");
        const expires = new Date(Date.now() + 3600000); // 1h

        await User.saveResetToken(email, token, expires);

        await sendRecoveryEmail(email, token);

        return res.render("forgot-password", {
            error: "Um link de recuperação foi enviado ao seu e-mail."
        });

    } catch (err) {
        console.error("Erro ao enviar recuperação:", err);
        return res.render("forgot-password", {
            error: "Erro ao enviar o e-mail. Tente novamente."
        });
    }
};



/* ============================================================
   RENDERIZAR TELA RESET PASSWORD
============================================================ */
export const renderResetPassword = async (req, res) => {
    const { token } = req.params;

    const user = await User.findByToken(token);
    if (!user)
        return res.send("Token inválido ou expirado.");

    return res.render("reset-password", { token, error: null });
};



/* ============================================================
   RESETAR SENHA
============================================================ */
export const resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { password, confirmPassword } = req.body;

        if (!password || !confirmPassword)
            return res.render("reset-password", { token, error: "Preencha todos os campos!" });

        if (password !== confirmPassword)
            return res.render("reset-password", { token, error: "As senhas não coincidem." });

        if (password.length < 8)
            return res.render("reset-password", { token, error: "A senha deve ter 8+ caracteres." });

        const user = await User.findByToken(token);
        if (!user)
            return res.send("Token inválido ou expirado.");

        const hashedPassword = await bcrypt.hash(password, 10);

        await User.updatePassword(user.id, hashedPassword);

        return res.redirect("/login");

    } catch (err) {
        console.error("Erro ao atualizar senha:", err);
        return res.render("reset-password", { 
            token, 
            error: "Erro ao atualizar a senha." 
        });
    }
};
