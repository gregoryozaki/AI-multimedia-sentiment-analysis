let videoRecorder;
let videoChunks = [];

const liveVideo = document.getElementById("liveVideo");
const videoPlayback = document.getElementById("videoPlayback");
const startBtn = document.getElementById("startVideoBtn");
const stopBtn = document.getElementById("stopVideoBtn");
const videoDataInput = document.getElementById("videoData");
const sendVideoBtn = document.getElementById("sendVideoBtn");

(async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ 
    video: true,
    audio: true 
});

    liveVideo.srcObject = stream;
    videoRecorder = new MediaRecorder(stream);

    videoRecorder.ondataavailable = e => videoChunks.push(e.data);

    videoRecorder.onstop = () => {
        const blob = new Blob(videoChunks, { type: "video/webm" });
        const url = URL.createObjectURL(blob);
        videoPlayback.src = url;
        videoPlayback.style.display = "block";

        const reader = new FileReader();
        reader.onload = () => {
            videoDataInput.value = reader.result;
            sendVideoBtn.disabled = false;
        };
        reader.readAsDataURL(blob);
    };
})();

startBtn.addEventListener("click", () => {
    videoChunks = [];
    videoRecorder.start();
    startBtn.disabled = true;
    stopBtn.disabled = false;
});

stopBtn.addEventListener("click", () => {
    videoRecorder.stop();
    stopBtn.disabled = true;
});
