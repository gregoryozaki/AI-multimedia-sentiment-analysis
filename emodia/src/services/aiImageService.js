import OpenAI from "openai";
import fs from "fs";

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

export async function analyzeImageEmotion(imagePath) {
    try {
        // LER A IMAGEM DO DISCO
        const buffer = fs.readFileSync(imagePath);

        // PRIMEIRO: UPLOAD DA IMAGEM PARA A OPENAI (CORRETO)
        const uploaded = await client.files.create({
            file: buffer,
            purpose: "vision"
        });

        const fileId = uploaded.id;

        console.log("📡 File enviado. file_id =", fileId);

        // SEGUNDO: CHAMADA DE ANÁLISE USANDO O FILE_ID
        const completion = await client.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "system",
                    content: "Você é um modelo especialista em análise emocional de imagens. Retorne somente JSON."
                },
                {
                    role: "user",
                    content: [
                        {
                            type: "input_image",
                            image_file: {
                                file_id: fileId
                            }
                        },
                        {
                            type: "text",
                            text: "Analise emocionalmente esta imagem."
                        }
                    ]
                }
            ]
        });

        const raw = completion.choices[0].message.content;

        const clean = raw.replace(/```json|```/g, "");

        return JSON.parse(clean);

    } catch (err) {
        console.error("❌ Erro IA imagem:", err);
        return null;
    }
}
