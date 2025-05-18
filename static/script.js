let mediaRecorder;
let audioChunks = [];

const recordButton = document.getElementById('recordButton');
const stopButton = document.getElementById('stopButton');
const transcription = document.getElementById('transcription');

recordButton.addEventListener('click', async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder = new MediaRecorder(stream);
    audioChunks = [];

    mediaRecorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
    };

    mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });  // <--- aquí cambia a webm
        const formData = new FormData();
        formData.append('audio', audioBlob, 'recording.webm');

        try {
            const response = await fetch('/transcribe', {
                method: 'POST',
                body: formData
            });
            const result = await response.json();
            console.log("Respuesta JSON:", result);
            transcription.value = result.text || result.error || 'No se recibió texto';
        } catch (error) {
            transcription.value = 'Error al enviar audio: ' + error.message;
        }

        stream.getTracks().forEach(track => track.stop());
    };

    mediaRecorder.start();
    recordButton.disabled = true;
    stopButton.disabled = false;
});

stopButton.addEventListener('click', () => {
    mediaRecorder.stop();
    recordButton.disabled = false;
    stopButton.disabled = true;
});
