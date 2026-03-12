console.log("🔧 emotion-gauge.js carregado!");

document.addEventListener("DOMContentLoaded", () => {
    console.log("🚀 DOM carregado, iniciando medidor...");

    const arcsGroup = document.getElementById("emotion-arcs");
    const needle = document.getElementById("needle");

    if (!arcsGroup) {
        console.error("❌ ERRO: elemento #emotion-arcs NÃO encontrado no DOM.");
        return;
    }

    if (!needle) {
        console.error("❌ ERRO: elemento #needle NÃO encontrado no DOM.");
        return;
    }

    console.log("✔ SVG encontrado. Construindo medidor...");

    const emotions = [
        { name: "Alegria", emoji: "😊", color: "#FCD34D", angle: -75 },
        { name: "Surpresa", emoji: "😲", color: "#FB923C", angle: -45 },
        { name: "Medo", emoji: "😨", color: "#C084FC", angle: -15 },
        { name: "Nojo", emoji: "🤢", color: "#4ADE80", angle: 15 },
        { name: "Raiva", emoji: "😠", color: "#EF4444", angle: 45 },
        { name: "Tristeza", emoji: "😢", color: "#60A5FA", angle: 75 }
    ];

    const centerX = 200;
    const centerY = 200;
    const innerRadius = 80;
    const outerRadius = 160;

    // Conversão polar → cartesiano
    const polarToCartesian = (cx, cy, radius, angleDeg) => {
        const rad = (angleDeg - 90) * (Math.PI / 180);
        return {
            x: cx + radius * Math.cos(rad),
            y: cy + radius * Math.sin(rad)
        };
    };

    // Criar arcos e emojis
    emotions.forEach((emotion, index) => {
        const start = -90 + index * 30;
        const end = start + 30;

        const p1 = polarToCartesian(centerX, centerY, outerRadius, start);
        const p2 = polarToCartesian(centerX, centerY, outerRadius, end);
        const p3 = polarToCartesian(centerX, centerY, innerRadius, end);
        const p4 = polarToCartesian(centerX, centerY, innerRadius, start);

        const path = `
            M ${p1.x} ${p1.y}
            A ${outerRadius} ${outerRadius} 0 0 1 ${p2.x} ${p2.y}
            L ${p3.x} ${p3.y}
            A ${innerRadius} ${innerRadius} 0 0 0 ${p4.x} ${p4.y}
            Z
        `;

        const g = document.createElementNS("http://www.w3.org/2000/svg", "g");

        const arc = document.createElementNS("http://www.w3.org/2000/svg", "path");
        arc.setAttribute("d", path);
        arc.setAttribute("fill", emotion.color);
        arc.setAttribute("stroke", "white");
        arc.setAttribute("stroke-width", "2");
        arc.setAttribute("opacity", "0.85");
        g.appendChild(arc);

        // Emoji
        const mid = start + 15;
        const pos = polarToCartesian(centerX, centerY, 105, mid);

        const emoji = document.createElementNS("http://www.w3.org/2000/svg", "text");
        emoji.textContent = emotion.emoji;
        emoji.setAttribute("x", pos.x);
        emoji.setAttribute("y", pos.y);
        emoji.setAttribute("text-anchor", "middle");
        emoji.setAttribute("dominant-baseline", "middle");
        emoji.setAttribute("class", "gauge-emoji");
        g.appendChild(emoji);

        arcsGroup.appendChild(g);
    });

    // Animação
    let idx = 0;
    setInterval(() => {
        needle.style.transform = `rotate(${emotions[idx].angle}deg)`;

        const emojis = document.querySelectorAll(".gauge-emoji");
        emojis.forEach((e, i) => {
            e.classList.toggle("active", i === idx);
        });

        idx = (idx + 1) % emotions.length;
    }, 2000);

    console.log("✔ Medidor carregado com sucesso!");
});
