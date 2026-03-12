import db from "../database/db.js";

class Emotion {

    static async create({ 
        userId, 
        emotion, 
        intensity, 
        confidence, 
        origin,
        notes, 
        type,
        content,
        imagePath 
    }) {

        const [result] = await db.query(`
            INSERT INTO emotions 
            (user_id, emotion, intensity, confidence, origin, notes, type, content, image_path)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
            userId,
            emotion,
            intensity,
            confidence,
            origin,
            notes,
            type,
            content,
            imagePath
        ]);

        return result.insertId;
    }

    static async findLastEmotions(userId) {
        const [rows] = await db.query(`
            SELECT emotion, intensity, confidence, origin, notes, image_path, type, content, created_at
            FROM emotions
            WHERE user_id = ?
            ORDER BY created_at DESC
            LIMIT 5
        `, [userId]);

        return rows;
    }

    static async getWeeklyStats(userId) {
        const [rows] = await db.query(`
            SELECT 
                DATE(created_at) AS date,
                AVG(intensity) AS avgIntensity
            FROM emotions
            WHERE user_id = ?
            AND created_at >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
            GROUP BY DATE(created_at)
            ORDER BY date ASC
        `, [userId]);

        return rows;
    }

    static async countToday(userId) {
        const [rows] = await db.query(`
            SELECT COUNT(*) AS total
            FROM emotions
            WHERE user_id = ?
            AND DATE(created_at) = CURDATE()
        `, [userId]);

        return rows[0].total;
    }

    static async countAll(userId) {
        const [rows] = await db.query(`
            SELECT COUNT(*) AS total
            FROM emotions 
            WHERE user_id = ?
        `, [userId]);

        return rows[0].total;
    }

    static async getEmotionOfMonth(userId) {
        const [rows] = await db.query(`
            SELECT emotion, COUNT(*) AS total
            FROM emotions
            WHERE user_id = ?
            AND MONTH(created_at) = MONTH(CURDATE())
            AND YEAR(created_at) = YEAR(CURDATE())
            GROUP BY emotion
            ORDER BY total DESC
            LIMIT 1
        `, [userId]);

        return rows.length > 0 ? rows[0].emotion : "Sem dados";
    }

    /* -----------------------------
       NOVOS MÉTODOS (dentro da classe!)
    ------------------------------ */

    static async getAvgIntensityByEmotion(userId) {
        const [rows] = await db.query(`
            SELECT emotion, AVG(intensity) AS avgIntensity
            FROM emotions
            WHERE user_id = ?
            GROUP BY emotion
            ORDER BY avgIntensity DESC
        `, [userId]);

        return rows;
    }

    static async getEmotionCounts(userId) {
        const [rows] = await db.query(`
            SELECT emotion, COUNT(*) AS total
            FROM emotions
            WHERE user_id = ?
            GROUP BY emotion
            ORDER BY total DESC
        `, [userId]);

        return rows;
    }

    static async getOrigins(userId) {
        const [rows] = await db.query(`
            SELECT origin, COUNT(*) AS total
            FROM emotions
            WHERE user_id = ?
            GROUP BY origin
            ORDER BY total DESC
        `, [userId]);

        return rows;
    }

}

export default Emotion;
