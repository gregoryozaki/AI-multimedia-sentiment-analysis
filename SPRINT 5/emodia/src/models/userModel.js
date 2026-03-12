import db from "../database/db.js";

class User {

    // Buscar usuário pelo e-mail
    static async findByEmail(email) {
        const [rows] = await db.query(
            "SELECT * FROM users WHERE email = ?",
            [email]
        );
        return rows[0];
    }

    // Criar usuário
    static async create({ name, birthday, email, password }) {
        const [result] = await db.query(
            `INSERT INTO users (name, birthday, email, password)
             VALUES (?, ?, ?, ?)`,
            [name, birthday, email, password]
        );

        return result.insertId;
    }

    // Salvar token de recuperação
    static async saveResetToken(email, token, expires) {
        await db.query(
            `UPDATE users 
             SET password_reset_token = ?, password_reset_expires = ?
             WHERE email = ?`,
            [token, expires, email]
        );
    }

    // Buscar usuário pelo token válido
    static async findByToken(token) {
        const [rows] = await db.query(
            `SELECT * FROM users 
             WHERE password_reset_token = ?
             AND password_reset_expires > NOW()`,
            [token]
        );
        return rows[0];
    }

    // Atualizar senha e limpar token
    static async updatePassword(id, newPassword) {
        await db.query(
            `UPDATE users 
             SET password = ?, password_reset_token = NULL, password_reset_expires = NULL
             WHERE id = ?`,
            [newPassword, id]
        );
    }
}

export default User;
