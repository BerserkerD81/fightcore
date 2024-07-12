import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import './ProfilePage.css';
import { getProfileImageByUsername } from '../firebaseFuntions.js';

const ProfilePage = ({ username, onLogout }) => {
  const [profileImage, setProfileImage] = useState('');

  useEffect(() => {
    const fetchProfileImage = async () => {
      try {
        const profileImageBase64 = await getProfileImageByUsername(localStorage.getItem('username'));
        setProfileImage(profileImageBase64);
      } catch (error) {
        console.error('Error fetching profile image:', error);
      }
    };

    fetchProfileImage();
  }, [username]);

  const handleLogout = () => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: '¡No podrás revertir esto!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, cerrar sesión'
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('username');
        window.location.reload();
      }
    });
  };

  const base64ToImageSrc = (base64String) => {
    return `data:image/jpeg;base64,${base64String}`;
  };

  return (
    <div className="profile-container flex flex-col items-center">
      <div className="profile-header">
        <div
          className="border-gradient-fight"
          style={{
            width: '40vh',
            height: '40vh',
            borderRadius: '50%',
            marginBottom: '20px',
            overflow: 'hidden'
          }}
        >
          <img
            src={base64ToImageSrc(profileImage)}
            className="box-img"
            alt="Profile"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>
  
        <h1
          id="username-placeholder"
          className="text-4xl font-bold text-center"
        >
          {localStorage.getItem('username')}
        </h1>
      </div>
  
      <button className="logout-button w-full px-3 py-2 mb-4 text-white bg-transparent border border-turquoise rounded" onClick={handleLogout}>
        Cerrar Sesión
      </button>
    </div>
  );
};

export default ProfilePage;
