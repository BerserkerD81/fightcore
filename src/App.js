import React, { useState, useEffect, useRef } from 'react';
import { setupIonicReact } from '@ionic/react';
import { IonIcon } from '@ionic/react';
import { add, home, search, person, chatbubble } from 'ionicons/icons';
import Modal from './components/partials/Modal';
import Post from './components/partials/Post';
import Chat from './components/partials/chats';
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

  const [isLoading, setIsLoading] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (
        containerRef.current &&
        containerRef.current.scrollTop + containerRef.current.clientHeight >= containerRef.current.scrollHeight
      ) {
        loadMorePosts();
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
  }, [posts]); // Dependencia de efecto para reajustar cuando cambian las publicaciones

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

  const loadMorePosts = () => {
    if (!isLoading) {
      setIsLoading(true);
      setTimeout(() => {
        const newPosts = [];
        for (let i = 0; i < 3; i++) {
          const newPost = generateRandomPost();
          newPosts.push(newPost);
        }
        setPosts(prevPosts => [...prevPosts, ...newPosts]);
        setIsLoading(false);
      }, 1000); // Simulación de carga
    }
  };

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div ref={containerRef} style={{ flex: 1, padding: '1rem', backgroundColor: '#191919', overflowY: 'auto', display: isModalOpen ? 'none' : 'block' }}>
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
        {isLoading && <p style={{ textAlign: 'center', marginTop: '1rem' }}>Cargando más publicaciones...</p>}
      </div>
      <footer className="footer rounded-b-5xl" style={{ display: isModalOpen ? 'none' : 'flex' }}>
        <button className="h-20 w-20 rounded-full flex items-center justify-center mx-2">
          <IonIcon icon={home} className="text-3xl" />
        </button>
        <button className="h-20 w-20 rounded-full flex items-center justify-center mx-2">
          <IonIcon icon={search} className="text-3xl" />
        </button>
        <button className="h-28 w-32 border-gradient-plus flex items-center justify-center focus:outline-none -mt-2" onClick={openModal}>
          <IonIcon icon={add} className="text-5xl text-white" />
        </button>
        <button className="h-20 w-20 rounded-full flex items-center justify-center mx-2">
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
