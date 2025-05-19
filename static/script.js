let mediaRecorder;
let audioChunks = [];

const recordButton = document.getElementById('recordButton');
const stopButton = document.getElementById('stopButton');
const transcription = document.getElementById('transcription');
const removeButton = document.getElementById('removeButton');

// 🎤 Iniciar grabación
recordButton.addEventListener('click', async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder = new MediaRecorder(stream);
    audioChunks = [];

    mediaRecorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
    };

    mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
        const formData = new FormData();
        formData.append('audio', audioBlob, 'recording.webm');

        try {
            const response = await fetch('/transcribe', {
                method: 'POST',
                body: formData
            });
            const result = await response.json();
            transcription.value = result.text || result.error || 'No se recibió texto';

            // 🔄 Actualizar la cola visualmente
            await actualizarColaVisual();
        } catch (error) {
            transcription.value = 'Error al enviar audio: ' + error.message;
        }

        stream.getTracks().forEach(track => track.stop());
    };

    mediaRecorder.start();
    recordButton.disabled = true;
    stopButton.disabled = false;
});

// 🛑 Detener grabación
stopButton.addEventListener('click', () => {
    mediaRecorder.stop();
    recordButton.disabled = false;
    stopButton.disabled = true;
    actualizarColaVisual();
});

// 🗑️ Eliminar el primer elemento de la cola
removeButton.addEventListener('click', async () => {
    try {
        await fetch('/', {
            method: 'POST'
        });
        await actualizarColaVisual();
    } catch (error) {
        console.error('Error al quitar elemento de la cola:', error);
    }
});

// 🔁 Función para actualizar visualmente la cola sin recargar
async function actualizarColaVisual() {
    try {
        const response = await fetch('/cola');
        const datos = await response.json();

        const lista = document.querySelector('.cola-lista');
        lista.innerHTML = '';  // Limpiar lista

        if (datos.length === 0) {
            const li = document.createElement('li');
            li.classList.add('text-muted');
            li.textContent = 'No hay elementos en la cola.';
            lista.appendChild(li);
        } else {
            datos.forEach(item => {
                const li = document.createElement('li');
                li.textContent = item;
                lista.appendChild(li);
            });
        }
    } catch (error) {
        console.error('Error al actualizar la cola:', error);
    }
}

// 👀 Cargar la cola al iniciar
actualizarColaVisual();