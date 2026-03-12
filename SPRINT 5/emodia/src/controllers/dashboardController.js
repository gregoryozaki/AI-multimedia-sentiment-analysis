import Emotion from "../models/emotionModel.js";

export const getDashboard = async (req, res) => {
  try {
    const userId = req.session.user?.id;
    if (!userId) return res.redirect("/login");

    // Data atual formatada
    const now = new Date();
    const currentDate = now.toLocaleDateString("pt-BR", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    const todayCount = await Emotion.countToday(userId);
    const totalCount = await Emotion.countAll(userId);
    const weeklyStats = await Emotion.getWeeklyStats(userId);
    const hasWeeklyData = weeklyStats.length > 0;
    const recent = await Emotion.findLastEmotions(userId);
    const emotionOfMonth = await Emotion.getEmotionOfMonth(userId);

    const intensityByEmotion = await Emotion.getAvgIntensityByEmotion(userId);
    const emotionCounts = await Emotion.getEmotionCounts(userId);
    const originCounts = await Emotion.getOrigins(userId);

    res.render("dashboard", {
        currentDate,
        todayCount,
        totalCount,
        weeklyStats,
        hasWeeklyData,
        recent,
        emotionOfMonth,
        intensityByEmotion,
        emotionCounts,
        originCounts
    });


  } catch (err) {
    console.error("Erro no Dashboard:", err);
    res.status(500).send("Erro ao carregar o dashboard");
  }
};
