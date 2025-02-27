import {set, ref, push, get, onValue,query } from "firebase/database";
import { database } from './firebaseConfig';
import Swal from 'sweetalert';

// Función para almacenar un mensaje
export const saveMessage = async (chatId, message) => {
  try {
    const messagesRef = ref(database, `chats/${chatId}/messages`);
    await push(messagesRef, message);
  } catch (error) {
    throw new Error('Error al guardar el mensaje: ' + error.message);
  }
};

// Función para cargar mensajes
export const loadMessages = (chatId, callback) => {
  try {
    const messagesRef = ref(database, `chats/${chatId}/messages`);
    onValue(messagesRef, (snapshot) => {
      const messages = snapshot.val();
      const messagesArray = messages ? Object.keys(messages).map(key => ({ id: key, ...messages[key] })) : [];
      callback(messagesArray);
    });
  } catch (error) {
    throw new Error('Error al cargar los mensajes: ' + error.message);
  }
};

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

// Función para buscar chats por nombre de usuario
export const findChatsByUsername = (username, onChatsUpdate) => {
  console.log("yo soy",username)
  try {
    const chatsRef = ref(database, 'chats');

    onValue(chatsRef, (snapshot) => {
      const chats = snapshot.val();
      const userChats = [];

      for (const chatId in chats) {
        const chat = chats[chatId];
        console.log("usuario1:",chat.participants.user1.username)
        console.log("usuario2:",chat.participants.user2.username)
        if (chat.participants.user1.username === username || chat.participants.user2.username === username) {
          const otherUser = chat.participants.user1.username === username ? chat.participants.user2 : chat.participants.user1;
          userChats.push({
            id: chatId,
            avatar: otherUser.profileImage,
            username: otherUser.username,
            message: chat.messages ? Object.values(chat.messages).pop().text : '', // Último mensaje
          });
        }
      }

      onChatsUpdate(userChats); // Llamar la función de actualización con los nuevos chats
    });
  } catch (error) {
    throw new Error('Error al buscar los chats: ' + error.message);
  }
};

// Función para crear un chat entre dos usuarios
// Función para crear un chat entre dos usuarios, verificando si ya existe
export const createChatBetweenUsers = async (user1, user2) => {
  try {
    // Buscar todos los chats
    const chatsRef = ref(database, 'chats');
    const snapshot = await get(chatsRef);
    const chats = snapshot.val();

    // Verificar si ya existe un chat entre estos dos usuarios
    for (const chatId in chats) {
      const chat = chats[chatId];
      if (
        (chat.participants.user1.username === user1.username &&
          chat.participants.user2.username === user2.username) ||
        (chat.participants.user1.username === user2.username &&
          chat.participants.user2.username === user1.username)
      ) {
        // Si ya existe, retornar el ID del chat existente
        return chatId;
      }
    }

    // Si no existe, crear un nuevo chat
    const newChatRef = push(chatsRef);
    const newChatKey = newChatRef.key;

    await set(newChatRef, {
      participants: {
        user1: {
          username: user1.username,
          profileImage: user1.profileImage,
        },
        user2: {
          username: user2.username,
          profileImage: user2.profileImage,
        }
      },
      messages: {}
    });

    return newChatKey;
  } catch (error) {
    throw new Error('Error al crear o encontrar el chat: ' + error.message);
  }
};

export const subirPublicacion = async(cuerpo, imagen,juego) => {
  try {
    if (!cuerpo || !imagen) {
      Swal("Error", "No puede subir una publicación vacía", "error");
      return;
    }
    const user = localStorage.getItem('username')
    const date = new Date().toLocaleDateString('es-ES',{
      day: '2-digit',
      month: '2-digit',
      year: '2-digit'
    });
    console.log(juego)
    const newPostRef = push(ref(database, 'publicaciones/'))
    if(juego === null){
      juego = "Sin Especificar"
    }
    return set(newPostRef, {
      creador: user,
      imagen: imagen,
      cuerpo: cuerpo,
      fecha_creacion: date,
      game: juego
      //juego: juego,
    })
      .then(() => {
        console.log(user+" "+imagen+" "+cuerpo)
        return ;
      })
      .catch((error) => {
        console.log(user+" "+imagen+" "+cuerpo)
        throw error;
      });
  } catch (error) {
    throw new Error('Error al crear publicacion: ' + error.message);
  }
};

export const getPosts = async (posts) => {
  const publicacionesRef = ref(database, 'publicaciones');
  const q = query(publicacionesRef);

  const snapshot = await get(q);
  if (snapshot.exists()) {
    const newPosts = [];
    snapshot.forEach(childSnapshot => {
      const data = childSnapshot.val();
      const existsInPosts = posts.some(post => post.id === childSnapshot.key); // Verificar si el post ya existe en la lista actual

      if (!existsInPosts) {
        newPosts.push({
          id: childSnapshot.key,
          username: data.creador,
          postImage: `data:image/jpeg;base64,${data.imagen}`,
          message: data.cuerpo,
          createdAt: data.fecha_creacion,
          game: data.game
        });
      } else {
        console.warn(`El post con ID ${childSnapshot.key} ya existe en la lista de posts.`);
      }
    });

    return newPosts.reverse();
  } else {
    return [];
  }
};


export const mostrarJuegos = async () => {
  const juegosRef = ref(database, 'games');
  const q = query(juegosRef);

  const snapshot = await get(q);
  if (snapshot.exists()) {
    const juegos = [];
    snapshot.forEach(childSnapshot => {
      juegos.push({
        id: childSnapshot.key,
        ...childSnapshot.val()
      });
    });
    return juegos;
  } else {
    return [];
  }
}