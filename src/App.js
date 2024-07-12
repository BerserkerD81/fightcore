import React, { useState, useEffect, useRef } from 'react';
import { setupIonicReact } from '@ionic/react';
import { IonIcon } from '@ionic/react';
import { add, home, search, person, chatbubble } from 'ionicons/icons';
import Modal from './components/partials/Modal';
import Post from './components/partials/Post';
import Chat from './components/partials/Chat';
import Messages from './components/partials/Messages';
import LoginGoogle from './components/partials/LoginGoogle';
import GameLibrary from './components/partials/gameLibrary';
import ProfilePage from './components/partials/ProfilePage';
import { getPosts, findChatsByUsername } from './firebaseFuntions';
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

setupIonicReact();

const App = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [posts, setPosts] = useState([]);
  const [chats, setChats] = useState([]);
  const [isLoadingPosts, setIsLoadingPosts] = useState(false);
  const [isLoadingChats, setIsLoadingChats] = useState(false);
  const [showPosts, setShowPosts] = useState(true);
  const [activeChat, setActiveChat] = useState(null);
  const [reloadPost, setReload] = useState(null);
  const containerRef = useRef(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [profileImage, setProfileImage] = useState('');
  const [showGameLibrary, setShowGameLibrary] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const reloadPage = () => {
    setPosts([]);
    setIsLoadingPosts(false);
    setShowPosts(true);
    setIsModalOpen(false);
    setShowGameLibrary(false);
    setActiveChat(false)
    setShowProfile(false)
  };
    

  useEffect(() => {
    const storedLoginStatus = localStorage.getItem('isLoggedIn');
    if (storedLoginStatus === 'true') {
      const storedUsername = localStorage.getItem('username');
      const storedProfileImage = localStorage.getItem('profileImage');
      setUsername(storedUsername);
      setProfileImage(storedProfileImage);
      setIsLoggedIn(true);
      loadMorePosts();
    }

    const handleScroll = () => {
      if (
        containerRef.current &&
        containerRef.current.scrollTop + containerRef.current.clientHeight >= containerRef.current.scrollHeight - 100
      ) {
        if (showPosts && !isLoadingPosts) {
          loadMorePosts();
        } else if (!showPosts && !isLoadingChats) {
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
  }, [posts, chats, showPosts]);

  useEffect(() => {
    if (username) {
      console.log('username:', username);
      findChatsByUsername(username, setChats);
    }
  }, [username]);

  const openModal = () =>{
    setIsLoadingChats(false);
    setShowGameLibrary(false);
    setActiveChat(false)
    setShowProfile(false) 
    setShowPosts(false)
    setIsModalOpen(true);
    
  } 
  const closeModal = () => setIsModalOpen(false);

  const toggleGameLibrary = () => {
    setIsLoadingChats(false);
    setIsModalOpen(false);
    setShowPosts(false);
    setActiveChat(false);
    setShowProfile(false);
    setShowGameLibrary(true);
  };

  const toggleProfile = () => {
    setIsLoadingChats(false);
    setIsModalOpen(false);
    setShowGameLibrary(false);
    setActiveChat(false)
    setShowPosts(false)
    setShowProfile(true);
  };

  const handleSubmit = (e, body, selectedImage) => {
    e.preventDefault();
    const newId = posts.length + 1;
    const newPost = {
      id: newId,
      avatar: 'https://via.placeholder.com/60',
      username: 'UsuarioNuevo',
      postImage: selectedImage || 'https://via.placeholder.com/600',
      message: body || 'Nuevo mensaje',
    };
    setPosts([...posts, newPost]);
    closeModal();
  };

  const handlePostDismiss = (postId) => {
    setPosts(posts.filter((post) => post.id !== postId));
  };

  const handleChatClick = (chat) => {
    console.log(`Hablando con ${chat.username}`);
    console.log('Datos del chat:', chat);
    setActiveChat(chat);
  };

  const handleChatDismiss = (chatId) => {
    setChats(chats.filter((chat) => chat.id !== chatId));
  };

  async function generateRandomPost() {
    let newPost = await getPosts(posts);
    return newPost;
  }

  const handleBackToChats = () => {
    setActiveChat(null);
  };

  const generateRandomChat = () => {
    const randomId = Math.floor(Math.random() * 1000);
    const randomAvatar = `https://via.placeholder.com/60?text=User${randomId}`;
    const randomMessage = `Este es el mensaje del chat ${randomId}.`;

    return {
      id: randomId,
      avatar: randomAvatar,
      username: `Usuario${randomId}`,
      message: randomMessage,
    };
  };

  const loadMorePosts = async () => {
    if (!isLoadingPosts) {
    setIsLoadingPosts(true);
    try {
      let newPosts = await generateRandomPost();
      setPosts(prevPosts => [...prevPosts, ...newPosts]);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
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
        setChats((prevChats) => [...prevChats, ...newChats]);
        setIsLoadingChats(false);
      }, 1000);
    }
  };

  const toggleView = () => {
    setShowPosts(false);
    setIsLoadingChats(true);
    setIsModalOpen(false);
    setShowGameLibrary(false);
    setShowProfile(false)
    setIsLoadingChats(false);
  };

  

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    localStorage.setItem('isLoggedIn', 'true');
    setUsername(localStorage.getItem('username'));
  };

  if (!isLoggedIn) {
    return <LoginGoogle onLoginSuccess={handleLoginSuccess} />;
  }

  const SetreloadPost = () => {
    setReload();
  }

  const uniquePosts = [...new Set(posts.map((post) => post.id))].map((id) => posts.find((post) => post.id === id));

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div
        ref={containerRef}
        style={{
          marginTop: '10px',
          flex: 1,
          padding: '1rem',
          backgroundColor: '#191919',
          overflowY: 'auto',
          display:!isLoadingChats && showPosts && !isModalOpen && !activeChat && !showGameLibrary && !showProfile ? 'block' : 'none',
        }}
      >
        {uniquePosts.map((post) => (
          <div key={post.id} style={{ marginBottom: '10px' }}>
            <Post
              id={post.id}
              avatar={post.avatar}
              username={post.username}
              postImage={post.postImage}
              message={post.message}
              game={post.game}
              currentUser={{
                username: username,
                profileImage: profileImage,
              }}
            />
          </div>
        ))}

        {isLoadingPosts && <p style={{ textAlign: 'center', marginTop: '1rem' }}>Cargando más publicaciones...</p>}
      </div>
      <div
        style={{
          flex: 1,
          padding: '1rem',
          backgroundColor: '#191919',
          overflowY: 'auto',
          display: !isLoadingChats && !showPosts && !isModalOpen && !activeChat && !showGameLibrary && !showProfile ? 'block' : 'none',
        }}
      >
        {chats.map((chat) => (
          <Chat
            key={chat.id}
            id={chat.id}
            avatar={chat.avatar}
            username={chat.username}
            message={chat.message}
            onDismiss={handleChatDismiss}
            onChatClick={handleChatClick}
          />
        ))}
        {isLoadingChats && !showPosts && !isModalOpen && !activeChat && !showGameLibrary && !showProfile && <p style={{ textAlign: 'center', marginTop: '1rem' }}>Cargando más chats...</p>}
      </div>
      <div style={{ display: isModalOpen ? 'block' : 'none' }}>
        <Modal isOpen={isModalOpen} onClose={closeModal} onSubmit={handleSubmit} />
      </div>
      <div style={{ display: activeChat ? 'block' : 'none', height: '100%' }}>
        {activeChat && (
          <Messages
            chatId={activeChat.id}
            avatar={activeChat.avatar}
            username={activeChat.username}
            message={activeChat.message}
            myUser={username}
            onBack={handleBackToChats}
          />
        )}
      </div>
      <div style={{ display: showGameLibrary ? 'block' : 'none', height: '100%' }}>
        {!showProfile && !showPosts && !isModalOpen && !activeChat && showGameLibrary &&<GameLibrary />}
      </div>
      <div style={{ display: showProfile ? 'block' : 'none', height: '100%' }}>
        {showProfile && !showPosts && !isModalOpen && !activeChat && !showGameLibrary && <ProfilePage />}
      </div>
      <footer
        className="footer rounded-b-5xl"
        style={{ display: isModalOpen || activeChat ? 'none' : 'flex' }}
      >
        <button className="h-20 w-20 rounded-full flex items-center justify-center mx-2">
          <IonIcon icon={home} className="text-3xl" onClick={reloadPage} />
        </button>
        <button className="h-20 w-20 rounded-full flex items-center justify-center mx-2">
          <IonIcon icon={search} onClick={toggleGameLibrary} className="text-3xl" />
        </button>
        <button
          className="h-28 w-32 border-gradient-plus flex items-center justify-center focus:outline-none -mt-2"
          onClick={openModal}
        >
          <IonIcon icon={add} className="text-5xl text-white" />
        </button>
        <button className="h-20 w-20 rounded-full flex items-center justify-center mx-2" onClick={toggleView}>
          <IonIcon icon={chatbubble} className="text-3xl" />
        </button>
        <button className="h-20 w-20 rounded-full flex items-center justify-center mx-2" onClick={toggleProfile}>
          <IonIcon icon={person} className="text-3xl" />
        </button>
      </footer>
      <Modal
        isModalOpen={isModalOpen}
        closeModal={closeModal}
        handleSubmit={handleSubmit}
        reloadPost={setReload}
        loadMorePosts={loadMorePosts}
      />
    </div>
  );
};

export default App;
