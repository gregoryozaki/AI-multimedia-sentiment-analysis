import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

function extractJSON(text) {
    try {
        text = text.replace(/```json/gi, "")
                   .replace(/```/g, "")
                   .trim();

        return JSON.parse(text);
    } catch (err) {
        console.error("❌ Falha ao extrair JSON:", err);
        return null;
    }
}

export async function analyzeEmotionFromText(text) {
    try {
        const response = await client.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "system",
                    content:
                        "Responda APENAS com JSON puro. Sem markdown. Sem ```.\n" +
                        "Analise o texto emocional do usuário.\n" +
                        "Formato de resposta obrigatório:\n" +
                        "{\n" +
                        "  \"emotion\": \"nome da emoção principal\",\n" +
                        "  \"intensity\": número de 0 a 10,\n" +
                        "  \"confidence\": número entre 0 e 1,\n" +
                        "  \"origin\": \"família | relacionamento | trabalho | saúde | estudos | financeiro | social | autoestima | indefinido\",\n" +
                        "  \"notes\": \"resumo da análise em 1 ou 2 frases\"\n" +
                        "}"
                },
                { role: "user", content: text }
            ],
            temperature: 0.2
        });

        let raw = response.choices[0].message.content;
        const parsed = extractJSON(raw);

        if (!parsed) {
            throw new Error("JSON inválido da IA");
        }

        return parsed;

    } catch (err) {
        console.error("Erro IA:", err);

        return {
            emotion: "indefinido",
            intensity: 0,
            confidence: 0,
            origin: "indefinido",
            notes: "Não foi possível analisar o texto."
        };
    }
}
