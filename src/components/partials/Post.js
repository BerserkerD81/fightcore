import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { createChatBetweenUsers, getProfileImageByUsername } from '../../firebaseFuntions';

const challengeImage = "https://oyster.ignimgs.com/mediawiki/apis.ign.com/street-fighter-x-tekken/8/8f/Punch.png?width=325";

const Post = ({ id,avatar, username, postImage, message, currentUser ,game}) => {
  const [chatPartnerAvatar, setChatPartnerAvatar] = useState(avatar);
  const [sonIguales, setIguales] = useState(true);
  useEffect(() => {
    if(currentUser.username === username){
      casoIguales();
    }
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

  const casoIguales = () => {
    setIguales(false)
  }
  const handleChallengeClick = async () => {
    try {
      const newChatKey = await createChatBetweenUsers(
        {
          username: currentUser.username,
          profileImage: ''
        },
        {
          username: username,
          profileImage: ''
        }
      );
      console.log(`Chat creado con ID: ${newChatKey}`);

      // Mostrar SweetAlert con imagen personalizada
      Swal.fire({
        imageUrl: challengeImage,
        imageWidth: 100,
        imageHeight: 100,
        showConfirmButton: false, // Ocultar el botón de confirmación
        html: '<p style="text-align:center;font-size:1.5em;">Here Comes a New Challenger!</p>' // Contenido HTML opcional
      });

    } catch (error) {
      console.error('Error al crear el chat:', error);
      // Mostrar SweetAlert de error si es necesario
      Swal.fire({
        title: 'Error',
        text: 'Hubo un error al crear el chat.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    }
  };

  return (
    <div className="border-gradient p-4 mb-4 relative">
      <div className="flex items-center mb-4">
        <img
          src={`data:image/jpeg;base64,${chatPartnerAvatar}`}
          alt="Avatar"
          className="w-15 h-15 rounded-full mr-4"
          style={{ objectFit: 'cover', width: '60px', height: '60px' }}
        />
        <h3 className="text-lg font-semibold">{username}</h3>
      </div>
      <h4 className="text-lg font-semibold">{game}</h4>
      <div className="mb-4">
        <p>{message}</p>
      </div>
      {postImage && (
        <div className="relative">
          <img
            src={postImage}
            alt="Post"
            className="w-full rounded-lg mb-2"
            style={{ maxWidth: '100%', height: 'auto' }}
          />
          <div className="absolute bottom-5 right-5">
            {sonIguales && 
            <div className="border-gradient-fight flex justify-center items-center">
              <img
                src={challengeImage}
                alt="Challenge"
                className="cursor-pointer"
                onClick={handleChallengeClick}
                style={{ width: '60px', height: '60px', zIndex: '10', marginLeft: '-2px', marginTop: '-2px' }}
              />
            </div>
            }
            
          </div>
        </div>
      )}
    </div>
  );
};

export default Post;
