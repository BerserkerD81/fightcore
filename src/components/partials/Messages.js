import React, { useState, useRef, useEffect } from 'react';
import { Plugins, Capacitor } from '@capacitor/core';
import { VoiceRecorder } from 'capacitor-voice-recorder';
import { CameraResultType, CameraSource } from '@capacitor/camera';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMicrophone, faMicrophoneSlash, faCamera, faPaperPlane, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { FaWaveSquare } from 'react-icons/fa';
import { saveMessage, loadMessages, getProfileImageByUsername } from '../../firebaseFuntions';

const { Camera } = Plugins;

const Messages = ({ chatId, username, avatar, onBack, myUser }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [recording, setRecording] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentPlaying, setCurrentPlaying] = useState(null);
  const [currentAudioWaves, setCurrentAudioWaves] = useState([]);
  const [chatPartner, setChatPartner] = useState(username);
  const [chatPartnerAvatar, setChatPartnerAvatar] = useState(avatar);
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
    const fetchProfileImage = async () => {
      try {
        const profileImage = await getProfileImageByUsername(username);
        setChatPartnerAvatar(profileImage);
      } catch (error) {
        console.error('Error al obtener la imagen de perfil:', error);
      }
    };

    fetchProfileImage();
  }, [username]);

  useEffect(() => {
    const handleNewMessages = (loadedMessages) => {
      setMessages(loadedMessages);
      if (scrollRef.current) {
        scrollRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
      }
    };

    loadMessages(chatId, handleNewMessages);
  }, [chatId]);

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
      text: newMessage,
      timestamp: new Date().toISOString(),
      sender: myUser,
    };

    console.log(newMessageObj);
    await saveMessage(chatId, newMessageObj);
    setNewMessage('');
  };

  const takePicture = async () => {
    try {
      if (!hasPermission.camera) {
        await Camera.requestPermissions();
      }

      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.Base64,
        source: CameraSource.Camera,
      });

      const newMessageObj = {
        image: `data:image/jpeg;base64,${image.base64String}`,
        timestamp: new Date().toISOString(),
        sender: myUser,
      };

      await saveMessage(chatId, newMessageObj);

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
        audio: audioFile,
        timestamp: new Date().toISOString(),
        sender: myUser,
      };

      await saveMessage(chatId, newMessageObj);
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
        <img src={`data:image/jpeg;base64,${chatPartnerAvatar}`} alt="Avatar" className="w-12 h-12 rounded-full mr-4" />
        <h2 className="text-lg font-bold" style={{ color: 'turquoise' }}>{chatPartner}</h2>
        <button onClick={onBack} style={{ marginLeft: 'auto', padding: '0.5rem', border: 'none', borderRadius: '5px', color: 'magenta', cursor: 'pointer' }}>
          <FontAwesomeIcon icon={faArrowLeft} />
        </button>
      </div>
      <div
        ref={messageListRef}
        className="flex-1 p-4 overflow-y-auto max-h-full"
        style={{ maxHeight: 'calc(100% - 160px)', position: 'relative', zIndex: 0 }}
      >
        {messages.map((message, index) => (
          <div
            key={message.id}
            className={`mb-4 ${message.sender === myUser ? 'self-end' : 'self-start'}`}
            ref={index === messages.length - 1 ? scrollRef : null}
          >
            <div
              className={`p-2 rounded-lg ${message.sender === myUser ? 'bg-turquoise text-white self-end' : 'bg-magenta text-white self-start'}`}
              style={{ maxWidth: '75%', wordWrap: 'break-word', backgroundColor: currentPlaying === message.id ? 'lightgreen' : '' }}
            >
              <span className="block text-xs text-white mt-1 font-bold italic">{message.sender}:</span>

              {message.text && <p>{message.text}</p>}
              {message.image && (
                <div className="flex items-center justify-center"> {/* Ajuste vertical y horizontal */}
                  <img
                    src={message.image}
                    alt="Sent"
                    className="max-w-full h-auto rounded-lg mt-2 cursor-pointer"
                    onClick={() => openFullscreenImage(message.image)}
                  />
                </div>
              )}
{message.audio && (
  <div className={`audio-player-container flex items-center ${currentPlaying === message.id ? 'bg-gray-200' : ''}`}>
    <button
      className="bg-transparent border-none outline-none cursor-pointer"
      onClick={() => playAudio(message.audio.path, message.audio.duration, message.id)}
    >
      {currentPlaying === message.id ? (
        <FontAwesomeIcon icon={faMicrophoneSlash} className="text-white" />
      ) : (
        <FontAwesomeIcon icon={faMicrophone} className="text-white" />
      )}
    </button>
    <div className="flex items-center ml-2 flex-1">
      {currentPlaying === message.id && (
        <>
          <div className="progress-bar-container ml-2 flex-1">
            <div className="progress-bar" style={{ width: `${progress}%`, backgroundColor: 'lightblue', height: '5px' }} />
          </div>
        </>
      )}
    </div>
  </div>
)}


            </div>
          </div>
        ))}

        {fullscreenImage && (
          <div
            className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-75 flex items-center justify-center z-50"
            onClick={closeFullscreenImage}
          >
            <img src={fullscreenImage} alt="Fullscreen" className="max-w-full max-h-full" />
          </div>
        )}
      </div>
      <div className="p-4 flex items-center border-t border-gray-300" style={{ position: 'relative', zIndex: 20 }}>
        <div className="flex items-center w-full bg-white rounded-full shadow-md px-3 py-2">
          <input
            type="text"
            value={newMessage}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            className="flex-1 w-full px-2 py-1 border-none rounded-full outline-none mx-1"
            style={{ minWidth: '0', color: 'black' }}
          />
          <button
            onClick={recording ? stopRecording : startRecording}
            className="bg-magenta text-white p-2 rounded-full border-none outline-none cursor-pointer mx-1"
          >
            <FontAwesomeIcon icon={recording ? faMicrophoneSlash : faMicrophone} />
          </button>
          <button
            onClick={takePicture}
            className="bg-magenta text-white p-2 rounded-full border-none outline-none cursor-pointer mx-1"
          >
            <FontAwesomeIcon icon={faCamera} />
          </button>
          <button
            onClick={sendMessage}
            className="bg-magenta text-white p-2 rounded-full border-none outline-none cursor-pointer mx-1"
          >
            <FontAwesomeIcon icon={faPaperPlane} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Messages;
