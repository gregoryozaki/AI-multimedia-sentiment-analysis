import Emotion from "../models/emotionModel.js";
import { analyzeEmotionFromText } from "../services/aiService.js";

export const renderTextForm = (req, res) => {
    res.render("register-text");
};

export const registerTextEmotion = async (req, res) => {
    try {
        const userId = req.session.user.id;
        const text = req.body.description;

        // 🔥 ANALISAR EMOÇÃO VIA IA
        const analysis = await analyzeEmotionFromText(text);

        await Emotion.create({
            userId,
            emotion: analysis.emotion,
            intensity: analysis.intensity,
            confidence: analysis.confidence,
            origin: analysis.origin,
            notes: analysis.notes,
            type: "text",
            content: text,
            imagePath: null
        });

        res.redirect("/dashboard");

    } catch (err) {
        console.error("❌ Erro ao registrar emoção de texto:", err);
        res.status(500).send("Erro ao registrar emoção.");
    }
};
