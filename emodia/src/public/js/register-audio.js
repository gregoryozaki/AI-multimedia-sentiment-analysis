let recorder;
let audioChunks = [];

const startBtn = document.getElementById("startBtn");
const stopBtn = document.getElementById("stopBtn");
const playback = document.getElementById("audioPlayback");
const audioDataInput = document.getElementById("audioData");
const sendBtn = document.getElementById("sendBtn");

startBtn.addEventListener("click", async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    recorder = new MediaRecorder(stream);

    audioChunks = [];
    recorder.ondataavailable = e => audioChunks.push(e.data);

    recorder.onstop = () => {
        const blob = new Blob(audioChunks, { type: "audio/webm" });
        const url = URL.createObjectURL(blob);

        playback.src = url;
        playback.style.display = "block";

        // base64 para enviar ao servidor
        const reader = new FileReader();
        reader.onload = () => {
            audioDataInput.value = reader.result;
            sendBtn.disabled = false;
        };
        reader.readAsDataURL(blob);
    };

    recorder.start();

    startBtn.disabled = true;
    stopBtn.disabled = false;
});

stopBtn.addEventListener("click", () => {
    recorder.stop();
    stopBtn.disabled = true;
});
