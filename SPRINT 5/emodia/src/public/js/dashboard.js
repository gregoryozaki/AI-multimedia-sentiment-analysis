const ctx = document.getElementById("weeklyChart");

if (ctx) {
    new Chart(ctx, {
        type: "line",
        data: {
            labels: weeklyLabels,
            datasets: [{
                label: "Intensidade média",
                data: weeklyData,
                borderWidth: 3,
                borderColor: "#7a00d3",
                backgroundColor: "rgba(122,0,211,0.15)",
                tension: 0.4,
                pointRadius: 5,
                pointBackgroundColor: "#7a00d3"
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    min: 0,
                    max: 10
                }
            }
        }
    });
}
