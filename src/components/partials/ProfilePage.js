import React from 'react';
import Post from './Post'; // Asegúrate de que la ruta de importación sea correcta

const ProfilePage = ({ username, profileImage, posts }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <div className="profile-header" style={{ marginBottom: '20px' }}>
        <img
          src={profileImage || "https://i.ibb.co/BGF5CPS/OIG3-removebg-preview.png"} // Imagen de perfil por defecto si no hay una
          alt="Perfil"
          style={{ width: '100px', height: '100px', borderRadius: '50%' }}
        />
        <h2>{username}</h2>
      </div>
      <div className="posts-container">
        {posts.map((post) => (
          <Post
            key={post.id}
            avatar={post.avatar}
            username={post.username}
            postImage={post.postImage}
            message={post.message}
          />
        ))}
      </div>
    </div>
  );
};

export default ProfilePage;

