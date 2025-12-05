const video = document.getElementById("camera");
const captureBtn = document.getElementById("captureBtn");
const canvas = document.getElementById("snapshot");
const sendWebcamBtn = document.getElementById("sendWebcamBtn");
const webcamImageInput = document.getElementById("webcamImageInput");

// Ativa a webcam
navigator.mediaDevices.getUserMedia({ video: true })
    .then(stream => {
        video.srcObject = stream;
    })
    .catch(err => {
        console.error("Erro ao acessar webcam:", err);
    });

// Captura da imagem
captureBtn.addEventListener("click", () => {
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const base64 = canvas.toDataURL("image/png");
    webcamImageInput.value = base64;

    sendWebcamBtn.classList.remove("hidden");
});
