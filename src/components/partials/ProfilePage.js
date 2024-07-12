import React from 'react';
import Swal from 'sweetalert2';
import './ProfilePage.css';  // Asegúrate de tener este archivo CSS para los estilos

const ProfilePage = ({ username, profileImage, onLogout }) => {
  const handleLogout = () => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "¡No podrás revertir esto!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, cerrar sesión'
    }).then((result) => {
      if (result.isConfirmed) {
        onLogout();
      }
    });
  };

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-image-container">
          <img
            src={profileImage || "https://i.ibb.co/BGF5CPS/OIG3-removebg-preview.png"}
            alt="Perfil"
            className="profile-image"
          />
          <h2 className="username">{username}</h2>
        </div>
      </div>
      <button className="logout-button" onClick={handleLogout}>Cerrar Sesión</button>
    </div>
  );
};

export default ProfilePage;
