import React, { useState, useRef, useEffect } from 'react';
import { Plugins, Capacitor } from '@capacitor/core';
import { VoiceRecorder } from 'capacitor-voice-recorder';
import { CameraResultType, CameraSource } from '@capacitor/camera';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMicrophone, faMicrophoneSlash, faCamera, faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { FaWaveSquare } from 'react-icons/fa';

const { Camera } = Plugins;

const Messages = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [recording, setRecording] = useState(false);
  const [hasPermission, setHasPermission] = useState({ camera: false, audio: false });
  const [currentPlaying, setCurrentPlaying] = useState(null);
  const [progress, setProgress] = useState(0);
  const [selectedImage, setSelectedImage] = useState(null); // Added state for selected image
  const messageListRef = useRef(null);
  const audioPlayerRef = useRef(new Audio());

  useEffect(() => {
    const checkPermissions = async () => {
      try {
        if (Capacitor.isNativePlatform()) {
          const cameraStatus = await Camera.requestPermissions();
          const audioStatus = await VoiceRecorder.requestAudioRecordingPermission();
          setHasPermission({
            camera: cameraStatus.camera === 'granted',
            audio: audioStatus.value === 'granted',
          });
        } else {
          setHasPermission({ camera: true, audio: true });
        }
      } catch (error) {
        console.error('Error al solicitar permisos:', error);
      }
    };

    checkPermissions();
  }, []);

  const sendMessage = async () => {
    if (!newMessage.trim() && !selectedImage) return;

    const newMessageObj = {
      id: messages.length + 1,
      text: newMessage,
      image: selectedImage, // Include selected image in message object
      timestamp: new Date().toISOString(),
      sender: 'user',
    };

    setMessages([...messages, newMessageObj]);
    setNewMessage('');
    setSelectedImage(null); // Clear selected image after sending message

    if (messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
    }
  };

  const takePicture = async () => {
    try {
      if (!hasPermission.camera) {
        const cameraStatus = await Camera.requestPermissions();
      }

      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.Uri,
        source: CameraSource.Camera,
      });

      const imageUrl = image.webPath;

      setSelectedImage(imageUrl); // Set selected image

    } catch (error) {
      console.error('Error al tomar la foto:', error);
    }
  };

  const startRecording = async () => {
    try {
      if (!hasPermission.audio) {
        VoiceRecorder.requestAudioRecordingPermission();
      }

      await VoiceRecorder.startRecording();
      setRecording(true);
    } catch (error) {
      console.error('Error al iniciar la grabación o solicitar permisos:', error);
    }
  };

  const stopRecording = async () => {
    try {
      const result = await VoiceRecorder.stopRecording();
      const { recordDataBase64, msDuration, mimeType } = result.value;

      const audioFile = {
        path: `data:${mimeType};base64,${recordDataBase64}`,
        duration: msDuration,
      };

      const newMessageObj = {
        id: messages.length + 1,
        audio: audioFile,
        timestamp: new Date().toISOString(),
        sender: 'user',
      };

      setMessages([...messages, newMessageObj]);
      setRecording(false);
    } catch (error) {
      console.error('Error al detener la grabación:', error);
    }
  };

  const playAudio = async (audioPath, duration, messageId) => {
    try {
      audioPlayerRef.current.src = audioPath;
      await audioPlayerRef.current.play();
      setCurrentPlaying(messageId);

      const updateProgress = () => {
        const currentTime = audioPlayerRef.current.currentTime;
        setProgress((currentTime / (duration / 1000)) * 100);
      };

      audioPlayerRef.current.addEventListener('timeupdate', updateProgress);
      audioPlayerRef.current.addEventListener('ended', () => {
        setCurrentPlaying(null);
        setProgress(0);
      });

    } catch (error) {
      console.error('Error al reproducir el audio:', error);
    }
  };

  const handleInputChange = (event) => {
    setNewMessage(event.target.value);
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      sendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div ref={messageListRef} className="flex-1 p-4 overflow-y-auto">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`mb-4 p-2 rounded-lg ${message.sender === 'user' ? 'bg-turquoise-400 self-end' : 'bg-magenta-400'}`}
          >
            {message.text && <p className="text-white">{message.text}</p>}
            {message.image && <img src={message.image} alt="Sent" className="max-w-xs rounded-lg mt-2" />}
            {message.audio && (
              <div className="audio-player-container">
                <button
                  className={`bg-green-500 hover:bg-green-600 text-white rounded-lg p-2 ${
                    currentPlaying === message.id ? 'pulse' : ''
                  }`}
                  onClick={() => playAudio(message.audio.path, message.audio.duration, message.id)}
                >
                  <FaWaveSquare className="wave-icon" />
                </button>
                <div className="progress-bar">
                  <div className="progress-bar-filled" style={{ width: `${currentPlaying === message.id ? progress : 0}%` }}></div>
                </div>
                <p className="text-xs text-gray-500 self-end ml-2">{`${(message.audio.duration / 1000).toFixed(1)}s`}</p>
              </div>
            )}
            <p className="text-xs text-gray-500 self-end mt-1">{new Date(message.timestamp).toLocaleTimeString()}</p>
          </div>
        ))}
      </div>
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white">
        <div className="flex items-center">
          <input
            type="text"
            className="flex-1 border rounded-lg py-2 px-4 text-base outline-none"
            placeholder="Escribe un mensaje..."
            value={newMessage}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
          />
          <button
            className={`bg-${recording ? 'red' : 'green'}-500 hover:bg-${recording ? 'red' : 'green'}-600 text-white rounded-lg p-2 ml-2`}
            onClick={recording ? stopRecording : startRecording}
          >
            <FontAwesomeIcon icon={recording ? faMicrophoneSlash : faMicrophone} />
          </button>
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white rounded-lg p-2 ml-2"
            onClick={takePicture}
          >
            <FontAwesomeIcon icon={faCamera} />
          </button>
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white rounded-lg p-2 ml-2"
            onClick={sendMessage}
          >
            <FontAwesomeIcon icon={faPaperPlane} />
          </button>
        </div>
      </div>
      <audio ref={audioPlayerRef} className="hidden" controls />
    </div>
  );
};

export default Messages;