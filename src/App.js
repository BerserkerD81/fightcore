import React, { useState, useEffect, useRef } from 'react';
import { setupIonicReact } from '@ionic/react';
import { IonIcon } from '@ionic/react';
import { add, home, search, person, chatbubble } from 'ionicons/icons';
import Modal from './components/partials/Modal';
import Post from './components/partials/Post';
import Chat from './components/partials/Chat';
import Messages from './components/partials/Messages';
import '@ionic/react/css/core.css';
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';
import './index.css';

// Configurar Ionic React
setupIonicReact();

const App = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [posts, setPosts] = useState([
    {
      id: 1,
      avatar: "https://via.placeholder.com/60",
      username: "Usuario1",
      postImage: "https://via.placeholder.com/600",
      message: "Este es el mensaje de la publicación 1."
    },
    {
      id: 2,
      avatar: "https://via.placeholder.com/60",
      username: "Usuario2",
      postImage: "https://via.placeholder.com/600",
      message: "Este es el mensaje de la publicación 2."
    },
    {
      id: 3,
      avatar: "https://via.placeholder.com/60",
      username: "Usuario3",
      postImage: "https://via.placeholder.com/600",
      message: "Este es el mensaje de la publicación 3."
    }
  ]);
  const [chats, setChats] = useState([
    {
      id: 1,
      avatar: "https://via.placeholder.com/60",
      username: "Usuario4",
      message: "Este es el mensaje del chat 1."
    },
    {
      id: 2,
      avatar: "https://via.placeholder.com/60",
      username: "Usuario5",
      message: "Este es el mensaje del chat 2."
    },
    {
      id: 3,
      avatar: "https://via.placeholder.com/60",
      username: "Usuario6",
      message: "Este es el mensaje del chat 3."
    }
  ]);

  const [isLoadingPosts, setIsLoadingPosts] = useState(false);
  const [isLoadingChats, setIsLoadingChats] = useState(false);
  const [showPosts, setShowPosts] = useState(true); // Estado para alternar entre posts y chats
  const [activeChat, setActiveChat] = useState(null); // Estado para el chat activo
  const containerRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (
        containerRef.current &&
        containerRef.current.scrollTop + containerRef.current.clientHeight >= containerRef.current.scrollHeight
      ) {
        if (showPosts) {
          loadMorePosts();
        } else {
          loadMoreChats();
        }
      }
    };

    if (containerRef.current) {
      containerRef.current.addEventListener('scroll', handleScroll);
    }

    return () => {
      if (containerRef.current) {
        containerRef.current.removeEventListener('scroll', handleScroll);
      }
    };
  }, [posts, chats, showPosts]); // Dependencia de efecto para reajustar cuando cambian las publicaciones o los chats

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleSubmit = (e, body, selectedImage) => {
    e.preventDefault();
    console.log('Cuerpo de la publicación:', body);
    console.log('URL de la imagen:', selectedImage);
    closeModal();
  };

  const handlePostDismiss = (postId) => {
    setPosts(posts.filter(post => post.id !== postId));
  };

  const handleChatClick = (chat) => {
    console.log(`Hablando con ${chat.username}`);
    console.log('Datos del chat:', chat);
    setActiveChat(chat); // Establecer el chat activo al hacer clic en un chat
  };

  const handleChatDismiss = (chatId) => {
    setChats(chats.filter(chat => chat.id !== chatId));
  };

  const generateRandomPost = () => {
    const randomId = Math.floor(Math.random() * 1000);
    const randomAvatar = `https://via.placeholder.com/60?text=User${randomId}`;
    const randomPostImage = `https://via.placeholder.com/600?text=Post${randomId}`;
    const randomMessage = `Este es el mensaje de la publicación ${randomId}.`;

    return {
      id: randomId,
      avatar: randomAvatar,
      username: `Usuario${randomId}`,
      postImage: randomPostImage,
      message: randomMessage
    };
  };

  const generateRandomChat = () => {
    const randomId = Math.floor(Math.random() * 1000);
    const randomAvatar = `https://via.placeholder.com/60?text=User${randomId}`;
    const randomMessage = `Este es el mensaje del chat ${randomId}.`;

    return {
      id: randomId,
      avatar: randomAvatar,
      username: `Usuario${randomId}`,
      message: randomMessage
    };
  };

  const loadMorePosts = () => {
    if (!isLoadingPosts) {
      setIsLoadingPosts(true);
      setTimeout(() => {
        const newPosts = [];
        for (let i = 0; i < 3; i++) {
          const newPost = generateRandomPost();
          newPosts.push(newPost);
        }
        setPosts(prevPosts => [...prevPosts, ...newPosts]);
        setIsLoadingPosts(false);
      }, 1000); // Simulación de carga
    }
  };

  const loadMoreChats = () => {
    if (!isLoadingChats) {
      setIsLoadingChats(true);
      setTimeout(() => {
        const newChats = [];
        for (let i = 0; i < 3; i++) {
          const newChat = generateRandomChat();
          newChats.push(newChat);
        }
        setChats(prevChats => [...prevChats, ...newChats]);
        setIsLoadingChats(false);
      }, 1000); // Simulación de carga
    }
  };

  const toggleView = () => {
    setShowPosts(prev => !prev); // Alternar entre posts y chats
  };

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div ref={containerRef} style={{ flex: 1, padding: '1rem', backgroundColor: '#191919', overflowY: 'auto', display: (showPosts && !isModalOpen && !activeChat) ? 'block' : 'none' }}>
        {posts.map(post => (
          <Post
            key={post.id}
            id={post.id}
            avatar={post.avatar}
            username={post.username}
            postImage={post.postImage}
            message={post.message}
            onDismiss={handlePostDismiss}
          />
        ))}
        {isLoadingPosts && <p style={{ textAlign: 'center', marginTop: '1rem' }}>Cargando más publicaciones...</p>}
      </div>
      <div style={{ flex: 1, padding: '1rem', backgroundColor: '#191919', overflowY: 'auto', display: (!showPosts && !isModalOpen && !activeChat) ? 'block' : 'none' }}>
        {chats.map(chat => (
          <Chat
            key={chat.id}
            id={chat.id}
            avatar={chat.avatar}
            username={chat.username}
            message={chat.message}
            onDismiss={handleChatDismiss}
            onChatClick={handleChatClick} // Pasar la función para manejar el clic en el chat
          />
        ))}
        {isLoadingChats && <p style={{ textAlign: 'center', marginTop: '1rem' }}>Cargando más chats...</p>}
      </div>
      {activeChat && (
        <Messages
          avatar={activeChat.avatar}
          username={activeChat.username}
          message={activeChat.message}
        />

      )}

<footer className="footer rounded-b-5xl" style={{ display: (isModalOpen||activeChat) ? 'none' : 'flex' }}>        <button className="h-20 w-20 rounded-full flex items-center justify-center mx-2">
          <IonIcon icon={home} className="text-3xl" />
        </button>
        <button className="h-20 w-20 rounded-full flex items-center justify-center mx-2">
          <IonIcon icon={search} className="text-3xl" />
        </button>
        <button className="h-28 w-32 border-gradient-plus flex items-center justify-center focus:outline-none -mt-2" onClick={openModal}>
          <IonIcon icon={add} className="text-5xl text-white" />
        </button>
        <button className="h-20 w-20 rounded-full flex items-center justify-center mx-2" onClick={toggleView}>
          <IonIcon icon={chatbubble} className="text-3xl" />
        </button>
        <button className="h-20 w-20 rounded-full flex items-center justify-center mx-2">
          <IonIcon icon={person} className="text-3xl" />
        </button>
      </footer>
      <Modal
        isModalOpen={isModalOpen}
        closeModal={closeModal}
        handleSubmit={handleSubmit}
      />
    </div>
  );
};

export default App;
