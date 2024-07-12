import React, { useState } from 'react';
import { IonIcon } from '@ionic/react';
import { camera } from 'ionicons/icons';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { signInWithEmailAndPassword, registerWithEmailAndPassword } from '../firebaseFuntions';
import Swal from 'sweetalert2'; // Importar SweetAlert2

const LoginGoogle = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [profileImageBase64, setProfileImageBase64] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [circleSize, setCircleSize] = useState('42vh');

  const handleUsernameChange = (e) => setUsername(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);
  const handleFullNameChange = (e) => setFullName(e.target.value);

  const toggleShowLogin = () => {
    setShowLogin(true);
    setShowRegister(false);
  };

  const toggleShowRegister = () => {
    setShowRegister(true);
    setShowLogin(false);
  };

  const onLogin = () => {
    signInWithEmailAndPassword(username, password)
      .then((userData) => {
        console.log('Usuario inició sesión:', userData);
        localStorage.setItem('username', userData.username);
        localStorage.setItem('profileImageBase64', userData.profileImage);
        onLoginSuccess();
        Swal.fire({
          icon: 'success',
          title: '¡Inicio de sesión exitoso!',
          text: `Bienvenido, ${userData.username}!`,
        });
      })
      .catch((error) => {
        console.error('Error de inicio de sesión:', error.message);
        Swal.fire({
          icon: 'error',
          title: '¡Error!',
          text: error.message,
        });
      });
  };
  const onRegister = () => {
    if (!profileImageBase64) {
      Swal.fire({
        icon: 'error',
        title: '¡Error!',
        text: 'Selecciona una imagen de perfil antes de registrar.',
      });
      return;
    }

    registerWithEmailAndPassword(username, fullName, password, profileImageBase64)
      .then(() => {
        console.log('Usuario registrado exitosamente.');
        localStorage.setItem('username', username);
        onLoginSuccess();
        Swal.fire({
          icon: 'success',
          title: '¡Registro exitoso!',
          text: 'Bienvenido a nuestra plataforma.',
        });
      })
      .catch((error) => {
        console.error('Error al registrar usuario:', error.message);
        Swal.fire({
          icon: 'error',
          title: '¡Error!',
          text: error.message,
        });
      });
  };

  const selectProfileImage = async (source) => {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.Base64,
        source: source,
      });

      if (image && image.base64String) {
        setProfileImageBase64(image.base64String);
      }
    } catch (error) {
      console.error('Error seleccionando la imagen:', error);
      Swal.fire({
        icon: 'error',
        title: '¡Error!',
        text: 'Error seleccionando la imagen.',
      });
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
      {/* Elementos visuales */}
      <div className="circleMagenta"></div>
      <div className="border-gradient-fight" style={{ width: circleSize, height: circleSize, borderRadius: '50%', marginBottom: '20px', overflow: 'hidden' }}>
        <img
          src={profileImageBase64 ? `data:image/jpeg;base64,${profileImageBase64}` : "https://i.ibb.co/BGF5CPS/OIG3-removebg-preview.png"}
          className="box-img"
          alt="Login illustration"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </div>
      <div className="circleTurquesa"></div>

      {/* Formulario de inicio de sesión y registro */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '40px' }}>
        <button className={`border-gradient-inverse ${showLogin ? 'active' : ''}`} onClick={toggleShowLogin} style={{ display: !showLogin ? 'block' : 'none' }}>
          Login
        </button>
        <button className={`border-gradient-inverse ${showRegister ? 'active' : ''}`} onClick={toggleShowRegister} style={{ display: !showRegister ? 'block' : 'none' }}>
          Register
        </button>
      </div>

      {showLogin && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={handleUsernameChange}
            style={{ marginBottom: '10px', padding: '8px', width: '100%', maxWidth: '300px', background: '#444', color: '#fff', border: '2px solid #FF00FF', borderRadius: '4px' }}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={handlePasswordChange}
            style={{ marginBottom: '10px', padding: '8px', width: '100%', maxWidth: '300px', background: '#444', color: '#fff', border: '2px solid #00FFFF', borderRadius: '4px' }}
          />

          <button className="border-gradient" onClick={onLogin} style={{ padding: '8px 16px', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
            Login
          </button>
        </div>
      )}

      {showRegister && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <input
            type="text"
            placeholder="Full Name"
            value={fullName}
            onChange={handleFullNameChange}
            style={{ marginBottom: '10px', padding: '8px', width: '100%', maxWidth: '300px', background: '#444', color: '#fff', border: '2px solid #FF00FF', borderRadius: '4px' }}
          />

          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={handleUsernameChange}
            style={{ marginBottom: '10px', padding: '8px', width: '100%', maxWidth: '300px', background: '#444', color: '#fff', border: '2px solid #00FFFF', borderRadius: '4px' }}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={handlePasswordChange}
            style={{ marginBottom: '10px', padding: '8px', width: '100%', maxWidth: '300px', background: '#444', color: '#fff', border: '2px solid #FF00FF', borderRadius: '4px' }}
          />

          <button className="border-gradient" onClick={() => selectProfileImage(CameraSource.Photos)} style={{ marginBottom: '10px', padding: '8px 16px', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
            <IonIcon icon={camera} className="mr-2 text-magenta" />
            Subir Foto
          </button>

          <button className="border-gradient" onClick={onRegister} style={{ padding: '8px 16px', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
            Register
          </button>
        </div>
      )}

      {/* Aquí puedes agregar otros elementos como botones de inicio de sesión con Google */}
    </div>
  );
};

export default LoginGoogle;
