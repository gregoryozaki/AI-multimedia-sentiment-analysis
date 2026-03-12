import fs from "fs";
import Emotion from "../models/emotionModel.js";
import OpenAI from "openai";

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

export const renderImageForm = (req, res) => {
    res.render("register-image", {
        emotionDetected: null,
        imagePreview: null,
        error: null
    });
};

export const registerImageEmotion = async (req, res) => {
    try {
        if (!req.session.user) return res.redirect("/login");
        const userId = req.session.user.id;

        let base64 = null;
        let mime = "image/png";
        let relativeImagePath = null;

        // 📌 Caso seja foto da WEBCAM
        if (req.body.webcamImage) {
            const data = req.body.webcamImage;

            if (!data.startsWith("data:image")) {
                throw new Error("Base64 inválido");
            }

            mime = data.substring(5, data.indexOf(";"));
            base64 = data.split(",")[1];

            // salvar em arquivo
            const filename = `webcam_${Date.now()}.png`;
            const filepath = `src/public/uploads/${filename}`;

            fs.writeFileSync(filepath, Buffer.from(base64, "base64"));

            relativeImagePath = `/uploads/${filename}`;
        }

        // 📌 Caso seja upload de arquivo normal
        else if (req.file) {
            const buffer = fs.readFileSync(req.file.path);
            base64 = buffer.toString("base64");
            mime = req.file.mimetype;

            relativeImagePath = "/" + req.file.path.replace("src/public/", "");
        } else {
            return res.render("register-image", {
                emotionDetected: null,
                imagePreview: null,
                error: "Nenhuma imagem enviada!"
            });
        }

        // 🔥 Processamento pela IA
        const response = await client.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "system",
                    content:
                        "Analise a expressão facial e retorne APENAS JSON PURO:\n" +
                        "{ \"emotion\":\"\", \"intensity\":0-10, \"confidence\":0-1, \"origin\":\"\", \"notes\":\"\" }"
                },
                {
                    role: "user",
                    content: [
                        { type: "text", text: "Analise:" },
                        {
                            type: "image_url",
                            image_url: { url: `data:${mime};base64,${base64}` }
                        }
                    ]
                }
            ],
            temperature: 0.2
        });

        let raw = response.choices[0].message.content;
        raw = raw.replace(/```json|```/g, "").trim();

        let analysis;
        try {
            analysis = JSON.parse(raw);
        } catch {
            analysis = {
                emotion: "indefinido",
                intensity: 5,
                confidence: 0.5,
                origin: "indefinido",
                notes: "Não foi possível analisar corretamente."
            };
        }

        // Salvar no banco
        await Emotion.create({
            userId,
            emotion: analysis.emotion,
            intensity: analysis.intensity,
            confidence: analysis.confidence,
            origin: analysis.origin,
            notes: analysis.notes,
            type: "image",
            content: null,
            imagePath: relativeImagePath
        });

        return res.render("register-image", {
            emotionDetected: analysis.emotion,
            imagePreview: relativeImagePath,
            error: null
        });

    } catch (err) {
        console.error("Erro IA imagem:", err);
        return res.render("register-image", {
            emotionDetected: null,
            imagePreview: null,
            error: "Erro ao analisar a imagem com a IA."
        });
    }
};
