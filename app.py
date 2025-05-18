from flask import Flask, render_template, request, jsonify
import speech_recognition as sr
import subprocess
import os

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/transcribe', methods=['POST'])
def transcribe():
    if 'audio' not in request.files:
        return jsonify({'error': 'No audio file provided'}), 400

    audio_file = request.files['audio']
    input_path = 'temp_input_audio.webm'
    output_path = 'temp_audio.wav'
    audio_file.save(input_path)
    print(f"Archivo guardado en {input_path}")
    print("Tamaño del archivo:", os.path.getsize(input_path), "bytes")

    
    ffmpeg_path = r"C:\Program Files\ffmpeg-2025-05-15-git-12b853530a-essentials_build\bin\ffmpeg.exe"

    try:
        subprocess.run([ffmpeg_path, '-y', '-i', input_path, output_path], check=True)
        print("Conversión a WAV exitosa")
    except subprocess.CalledProcessError as e:
        print("Error al convertir:", e)
        return jsonify({'error': f'Error converting audio: {e}'}), 400

    recognizer = sr.Recognizer()
    try:
        with sr.AudioFile(output_path) as source:
            audio = recognizer.record(source)
            text = recognizer.recognize_google(audio)
            print("Texto reconocido:", text)
    except sr.UnknownValueError:
        text = "No se entendió el audio."
    except sr.RequestError as e:
        text = f"Error con el servicio de reconocimiento: {e}"
    except Exception as e:
        text = f"Error al procesar el audio: {e}"

    os.remove(input_path)
    os.remove(output_path)

    return jsonify({'text': text})

if __name__ == '__main__':
    app.run(debug=True)
