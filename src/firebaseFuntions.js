// firebaseFunctions.js
import { ref, get, set } from "firebase/database";
import { database } from './firebaseConfig';

// Función para iniciar sesión
export const signInWithEmailAndPassword = (username, password) => {
  return get(ref(database, 'users/' + username))
    .then((snapshot) => {
      const userData = snapshot.val();
      if (userData && userData.password === password) {
        return userData; // Retorna los datos del usuario si la contraseña es correcta
      } else {
        throw new Error('Usuario o contraseña incorrectos.');
      }
    })
    .catch((error) => {
      throw error;
    });
};

// Función para registrar usuario
export const registerWithEmailAndPassword = (username, fullName, password, profileImage) => {
  return get(ref(database, 'users/' + username))
    .then((snapshot) => {
      const userData = snapshot.val();
      if (userData) {
        throw new Error('El usuario ya existe.'); // Lanza un error si el usuario ya está registrado
      } else {
        // Si el usuario no existe, procede con el registro
        return set(ref(database, 'users/' + username), {
          fullName: fullName,
          username: username,
          password: password,
          profileImage: profileImage,
          // Otros datos que desees almacenar
        })
          .then(() => {
            return { success: true };
          })
          .catch((error) => {
            throw error;
          });
      }
    })
    .catch((error) => {
      throw error;
    });
};

// Función para obtener la imagen de perfil del usuario
export const getProfileImageByUsername = (username) => {
  return get(ref(database, 'users/' + username + '/profileImage'))
    .then((snapshot) => {
      const profileImage = snapshot.val();
      if (profileImage) {
        return profileImage;
      } else {
        throw new Error('No se encontró una imagen de perfil para el usuario.');
      }
    })
    .catch((error) => {
      throw error;
    });
};
