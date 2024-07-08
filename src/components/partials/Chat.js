import React, { useState, useRef, useEffect } from 'react';
import {getProfileImageByUsername } from '../../firebaseFuntions';

const Chat = ({ id, avatar, username, message, onDismiss, onChatClick }) => {
  const [chatPartnerAvatar, setChatPartnerAvatar] = useState(avatar);


  useEffect(() => {
    const fetchProfileImage = async () => {
      try {
        const profileImage = await getProfileImageByUsername(username); // Obtener la imagen de perfil en base64
        setChatPartnerAvatar(profileImage); // Actualizar el estado de la imagen de perfil
      } catch (error) {
        console.error('Error al obtener la imagen de perfil:', error);
        // Manejar el error según sea necesario
      }
    };

    fetchProfileImage();
  }, [username]); // Ejecutar el efecto cada vez que cambie el nombre de usuario


  const handleDismiss = () => {
    if (typeof onDismiss === 'function') {
      onDismiss(id);
    }
  };

  const handleClick = () => {
    if (typeof onChatClick === 'function') {
      onChatClick({ id, avatar, username, message });
    }
  };

  const getFirstTenWords = (text) => {
    if(text){
    const words = text.split(' ');
    return words.slice(0, 10).join(' ') + (words.length > 10 ? '...' : '');}
    else{return "se ha mandado un archivo multimedia"}
    
  };

  return (
    <div className="border-gradient-inverse p-4 mb-4 relative">
      <div className="flex items-center mb-4" onClick={handleClick}>
        <img
          src={`data:image/jpeg;base64,${chatPartnerAvatar}`}
          alt="Avatar"
          className="w-15 h-15 rounded-full mr-4"
          style={{ objectFit: 'cover' ,width:'60px',height:'60px'}}
        />
        <div className="flex flex-col">
          <h3 className="text-lg font-semibold">{username}</h3>
          <p className="mt-1 max-w-xs break-words">{getFirstTenWords(message)}</p>
        </div>
      </div>
      <button
        className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        onClick={handleDismiss}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>
  );
};

export default Chat;
