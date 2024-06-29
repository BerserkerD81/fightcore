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
  const [progress, setProgress] = useState(0);
  const [currentPlaying, setCurrentPlaying] = useState(null);
  const [currentAudioWaves, setCurrentAudioWaves] = useState([]);
  const [chatPartner, setChatPartner] = useState('Nombre del Usuario');
  const [chatPartnerAvatar, setChatPartnerAvatar] = useState('https://via.placeholder.com/60');
  const [hasPermission, setHasPermission] = useState({ camera: false, audio: false });
  const [fullscreenImage, setFullscreenImage] = useState(null);
  const messageListRef = useRef(null);
  const scrollRef = useRef(null);
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

  useEffect(() => {
    const initialMessages = [
      {
        id: 1,
        text: '¡Hola! ¿Cómo estás?',
        timestamp: '2024-06-29T10:30:00Z',
        sender: 'user',
      },
      {
        id: 2,
        text: '¡Hola! Estoy bien, ¿y tú?',
        timestamp: '2024-06-29T10:32:00Z',
        sender: 'other_user',
      },
      {
        id: 3,
        text: '¡Genial! Acabo de tomar esta foto.',
        image: 'https://via.placeholder.com/300',
        timestamp: '2024-06-29T10:35:00Z',
        sender: 'user',
      },
      {
        id: 4,
        text: '¡Qué bonita foto!',
        timestamp: '2024-06-29T10:36:00Z',
        sender: 'other_user',
      },
    ];

    setMessages(initialMessages);
  }, []);

  const updateAudioWaves = (duration) => {
    const wavesCount = Math.ceil(duration / 100); 
    const waves = Array.from({ length: wavesCount }, (_, index) => ({
      id: index,
    }));
    setCurrentAudioWaves(waves);
  };

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    const newMessageObj = {
      id: messages.length + 1,
      text: newMessage,
      timestamp: new Date().toISOString(),
      sender: 'user',
    };

    const confirmationMessageObj = {
      id: messages.length + 2,
      text: 'Mensaje enviado',
      timestamp: new Date().toISOString(),
      sender: 'other_user',
    };

    setMessages([...messages, newMessageObj, confirmationMessageObj]);
    setNewMessage('');

    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  };

  const takePicture = async () => {
    try {
      if (!hasPermission.camera) {
        await Camera.requestPermissions();
      }

      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.Uri,
        source: CameraSource.Camera,
      });

      const imageUrl = Capacitor.convertFileSrc(image.path);

      const newMessageObj = {
        id: messages.length + 1,
        image: imageUrl,
        timestamp: new Date().toISOString(),
        sender: 'user',
      };

      const confirmationMessageObj = {
        id: messages.length + 2,
        text: 'Imagen enviada',
        timestamp: new Date().toISOString(),
        sender: 'other_user',
      };

      setMessages([...messages, newMessageObj, confirmationMessageObj]);

    } catch (error) {
      console.error('Error al tomar la foto:', error);
    }
  };

  const startRecording = async () => {
    try {
      if (!hasPermission.audio) {
        await VoiceRecorder.requestAudioRecordingPermission();
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

      const confirmationMessageObj = {
        id: messages.length + 2,
        text: 'Audio enviado',
        timestamp: new Date().toISOString(),
        sender: 'other_user',
      };

      setMessages([...messages, newMessageObj, confirmationMessageObj]);
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

      updateAudioWaves(duration);

      const updateProgress = () => {
        const currentTime = audioPlayerRef.current.currentTime;
        setProgress((currentTime / (duration / 1000)) * 100);
      };

      audioPlayerRef.current.addEventListener('timeupdate', updateProgress);
      audioPlayerRef.current.addEventListener('ended', () => {
        setCurrentPlaying(null);
        setProgress(0);
        setCurrentAudioWaves([]);
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

  const openFullscreenImage = (imageUrl) => {
    setFullscreenImage(imageUrl);
  };

  const closeFullscreenImage = () => {
    setFullscreenImage(null);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="bg-custom text-white p-4 flex items-center" style={{ zIndex: 10 }}>
        <img src={chatPartnerAvatar} alt="Avatar" className="w-12 h-12 rounded-full mr-4" />
        <h2 className="text-lg font-bold">{chatPartner}</h2>
      </div>
      <div
        ref={messageListRef}
        className="flex-1 p-4 overflow-y-auto max-h-full"
        style={{ maxHeight: 'calc(100% - 160px)', position: 'relative', zIndex: 0 }}
      >
        {messages.map((message, index) => (
          <div
            key={message.id}
            className={`mb-4 ${message.sender === 'user' ? 'self-end' : 'self-start'}`}
            ref={index === messages.length - 1 ? scrollRef : null}
          >
            <div
              className={`p-2 rounded-lg ${message.sender === 'user' ? 'bg-turquoise text-white self-end' : 'bg-magenta text-white self-start'}`}
              style={{ maxWidth: '75%', wordWrap: 'break-word' }}
            >
              {message.text && <p>{message.text}</p>}
              {message.image && (
                <img
                  src={message.image}
                  alt="Sent"
                  className="max-w-full h-auto rounded-lg mt-2 cursor-pointer"
                  onClick={() => openFullscreenImage(message.image)}
                />
              )}
              {message.audio && (
                <div className="audio-player-container flex items-center">
                  <button
                    className={`bg-green-500 hover:bg-green-600 text-white rounded-lg p-2 ${currentPlaying === message.id ? 'pulse' : ''}`}
                    onClick={() => playAudio(message.audio.path, message.audio.duration, message.id)}
                  >
                    <FaWaveSquare className="wave-icon" />
                  </button>
                  <div className="progress-bar flex items-center ml-2">
                    <div className="progress-bar-filled" style={{ width: `${currentPlaying === message.id ? progress : 0}%` }}>
                      {/* Ondas de audio */}
                      <div className="audio-waves">
                        {currentAudioWaves.map(wave => (
                          <div key={wave.id} className="audio-wave"></div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 self-end ml-2">{`${(message.audio.duration / 1000).toFixed(1)}s`}</p>
                </div>
              )}
              <p className="text-xs text-gray-500 self-end mt-1">{new Date(message.timestamp).toLocaleTimeString()}</p>
            </div>
          </div>
        ))}
      </div>
      {fullscreenImage && (
        <div className="fixed top-0 left-0 bottom-0 right-0 z-50 bg-black flex items-center justify-center" style={{ overflow: 'auto' }}>
          <img
            src={fullscreenImage}
            alt="Fullscreen"
            className="max-w-screen-xl max-h-screen cursor-pointer"
            onClick={closeFullscreenImage}
          />
        </div>
      )}
      <div className="fixed bottom-0 left-0 right-0 p-4" style={{ bottom: '0px' }}>
        <div className="flex items-center">
          <input
            type="text"
            className="flex-1 border rounded-lg py-2 px-4 text-black outline-none"
            placeholder="Escribe un mensaje..."
            value={newMessage}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            style={{ zIndex: 10 }}
          />
          <button
            className="rounded-lg p-2 ml-2"
            style={{ backgroundColor: recording ? '#E53E3E' : '#48BB78', color: 'white' }}
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
