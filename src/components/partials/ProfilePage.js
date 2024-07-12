import React, { useState, useEffect } from 'react';
import { getFirestore, collection, getDocs } from 'firebase/firestore';

const ProfilePage = ({ username, profileImage, posts }) => {
  const [description, setDescription] = useState('Descripción inicial');
  const [isEditing, setIsEditing] = useState(false);
  const [games, setGames] = useState([]);
  const [selectedGame, setSelectedGame] = useState('');

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    setIsEditing(false);
    // Aquí podrías también actualizar la descripción en una base de datos o en el estado global
  };

  useEffect(() => {
    const fetchGames = async () => {
      const db = getFirestore();
      const gamesCollection = collection(db, 'games');
      const gamesSnapshot = await getDocs(gamesCollection);
      const gamesList = gamesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setGames(gamesList);
    };

    fetchGames();
  }, []);

  return (
    <div style={styles.container}>
      <div className="profile-header" style={styles.profileHeader}>
        <div style={styles.profileImageContainer}>
          <img
            src={profileImage || "https://i.ibb.co/BGF5CPS/OIG3-removebg-preview.png"}
            alt="Perfil"
            style={styles.profileImage}
          />
          <h2 style={styles.username}>{username}</h2>
        </div>
        {!isEditing ? (
          <>
            <p style={styles.description}>{description}</p>
            <button style={styles.button} onClick={handleEdit}>Editar Descripción</button>
          </>
        ) : (
          <>
            <textarea
              style={styles.textarea}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <button style={styles.button} onClick={handleSave}>Guardar</button>
          </>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
    maxWidth: '600px',
    margin: '0 auto',
  },
  profileHeader: {
    marginBottom: '20px',
    textAlign: 'center',
  },
  profileImageContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  profileImage: {
    width: '100px',
    height: '100px',
    borderRadius: '50%',
    marginRight: '20px',
  },
  username: {
    fontSize: '24px',
    fontWeight: 'bold',
  },
  description: {
    margin: '10px 0',
  },
  button: {
    backgroundColor: '#007BFF',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  textarea: {
    width: '100%',
    height: '100px',
    padding: '10px',
    borderRadius: '5px',
    borderColor: '#ccc',
  },
  gameSelector: {
    marginTop: '20px',
    textAlign: 'center',
  },
  label: {
    display: 'block',
    marginBottom: '10px',
  },
  select: {
    padding: '10px',
    borderRadius: '5px',
    borderColor: '#ccc',
  },
  gameDetails: {
    marginTop: '20px',
  },
  gameCard: {
    border: '1px solid #ccc',
    borderRadius: '5px',
    padding: '20px',
    textAlign: 'center',
  },
  gameTitle: {
    fontSize: '20px',
    fontWeight: 'bold',
  },
  gameImage: {
    width: '200px',
    height: 'auto',
    marginBottom: '10px',
  },
};

export default ProfilePage;


