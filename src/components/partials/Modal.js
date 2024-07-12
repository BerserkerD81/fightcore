import React, { useState } from 'react';
import { IonIcon } from '@ionic/react';
import { arrowBack, camera, images, shareOutline, gameController } from 'ionicons/icons';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { subirPublicacion, mostrarJuegos } from '../../firebaseFuntions';

const Modal = ({ isModalOpen, closeModal, handleSubmit, setReload, loadMorePosts }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [body, setBody] = useState('');
  const [showActionSheet, setShowActionSheet] = useState(false);
  const [showGames, setShowGames] = useState(false);
  const [image64, setImage64] = useState(null);
  const [games, setGames] = useState([]);
  const [selectedGame, setSelectedGame] = useState(null);

  const base64ToImageSrc = (base64String) => {
    return `data:image/jpeg;base64,${base64String}`;
  };

  const selectImage = async (source) => {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.Base64,
        source: source,
      });

      if (image && image.base64String) {
        const img2 = base64ToImageSrc(image.base64String);
        setSelectedImage(img2);
        setImage64(image.base64String);
      }
    } catch (error) {
      console.error('Error seleccionando la imagen:', error);
    }
  };

  const uploadPublicacion = async (cuerpo, imagen,juego) => {
    console.log("CUERPO: " + cuerpo)
    try {
      await subirPublicacion(cuerpo, imagen,juego);
    } catch (error) {
      console.error('Error al crear publicacion:', error);
    }
  };

  const handleClick = () => {
    uploadPublicacion(body, image64,selectedGame);
    if (typeof onChatClick === 'function') {
      setReload();
      loadMorePosts();
    }
    closeModal();
  }

  const handleGames = async () => {
    const games = await mostrarJuegos();
    console.log("GAMES: ", games)
    setGames(games);
    setShowGames(true);
  }
  const handleChange = (event) => {
    console.log("GAME: "+event.target.value)
    setSelectedGame(event.target.value);
  };

  return (
    isModalOpen && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-custom-background">
        <div className="bg-transparent w-80 md:w-2/3 lg:w-1/2 xl:w-1/3">
          <div className="flex justify-between items-center border-gradient-inverse">
            <IonIcon icon={arrowBack} className="text-3xl magenta" onClick={closeModal} />
            <h2 className="text-lg font-semibold text-center flex-1">Nueva publicación</h2>
            <IonIcon icon={shareOutline} onClick={handleSubmit} className="text-3xl rotate-left turquoise" />
          </div>
          <div className="border-gradient">
            <div className="">
              <div className="flex flex-col items-center">
                <label className="block text-white">Cuerpo de la publicación</label>
                <textarea
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  className="w-full px-3 py-2 text-white bg-transparent border rounded resize-none"
                  placeholder="Escribe tu publicación"
                  style={{ minHeight: '100px', borderRadius: '10px', marginTop: '8px' }}
                  required
                />
              </div>
            </div>
            {selectedImage ? (
              <img
                src={selectedImage}
                alt="Selected"
                className="w-full mb-4 object-contain"
                style={{ maxWidth: '100%', maxHeight: '200px' }}
              />
            ) : (
              <div className="w-full mb-4 h-48 bg-white rounded-md bg-opacity-0"></div>
            )}
            <button
              className="w-full px-3 py-2 mb-4 text-white bg-transparent border border-turquoise rounded"
              onClick={() => setShowActionSheet(true)}
            >
              <IonIcon icon={camera} className="mr-2 text-magenta" />
              Subir Foto
            </button>
            <div className="flex flex-col space-y-2">
              <button className="w-full px-3 py-2 text-white bg-transparent border border-turquoise rounded" onClick={handleGames}>
                <IonIcon icon={gameController} className="mr-2 text-magenta" />
                Elegir juego
              </button>
            </div>
            {showActionSheet && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                <div className="content-custom bg-opacity-100 rounded-lg w-full md:w-2/3 lg:w-1/2 xl:w-1/3 p-4">
                  <button
                    className="w-full px-3 py-2 mb-4 border-magenta rounded"
                    onClick={() => {
                      selectImage(CameraSource.Camera);
                      setShowActionSheet(false);
                    }}
                  >
                    <IonIcon icon={camera} className="mr-2" />
                    Tomar foto
                  </button>
                  <button
                    className="w-full px-3 py-2 mb-4 border-turquoise rounded"
                    onClick={() => {
                      selectImage(CameraSource.Photos);
                      setShowActionSheet(false);
                    }}
                  >
                    <IonIcon icon={images} className="mr-2" />
                    Elegir desde la galería
                  </button>
                  <button
                    className="w-full px-3 py-2 border-magenta rounded"
                    onClick={() => setShowActionSheet(false)}
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            )}
            {showGames && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                <div className="content-custom bg-opacity-100 rounded-lg w-full md:w-2/3 lg:w-1/2 xl:w-1/3 p-4">
                <select className="w-full px-3 py-2 mb-4 border-magenta rounded" value={selectedGame} onChange={handleChange}>
                  <option value="" disabled selected>
                    Seleccione una opción
                  </option>
                  {games.map((option) => (
                    <option key={option.title} value={option.title}>
                      {option.title}
                    </option>
                  ))}
                </select>
                  <button
                    className="w-full px-3 py-2 border-magenta rounded"
                    onClick={() => setShowGames(false)}
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            )}
            <button
              className="w-full px-3 py-2 text-white bg-transparent border border-turquoise rounded mt-4"
              onClick={handleClick}
            >
              Publicar
            </button>
          </div>
        </div>
      </div>
    )
  );
};

export default Modal;
