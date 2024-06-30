import React, { useState } from 'react';
import { IonIcon } from '@ionic/react';
import { arrowBack, camera, images, shareOutline, person, gameController } from 'ionicons/icons';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

const Modal = ({ isModalOpen, closeModal, handleSubmit }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [body, setBody] = useState('');
  const [showActionSheet, setShowActionSheet] = useState(false);

  const selectImage = async (source) => {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.Uri,
        source: source,
      });

      if (image) {
        setSelectedImage(image.webPath);
      }
    } catch (error) {
      console.error('Error seleccionando la imagen:', error);
    }
  };

  return (
    isModalOpen && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-custom-background">
        <div className="bg-transparent w-80  md:w-2/3 lg:w-1/2 xl:w-1/3">
          <div className="flex justify-between items-center border-gradient-inverse">
            <IonIcon icon={arrowBack} className="text-3xl magenta" onClick={closeModal} />
            <h2 className="text-lg font-semibold text-center flex-1">Nueva publicación</h2>
            <IonIcon icon={shareOutline} onClick={handleSubmit} className="text-3xl rotate-left turquoise" />
          </div>
          <div className=" border-gradient">
            <div className="">
              <div className="flex flex-col items-center">
                <label className="block text-white">Cuerpo de la publicación</label>
                <textarea
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  className="w-full px-3 py-2 text-white bg-transparent border rounded resize-none"
                  placeholder="¿Qué quieres hacer?"
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
              <button className="w-full px-3 py-2 text-white bg-transparent border border-turquoise rounded">
                <IonIcon icon={person} className="mr-2 text-magenta" />
                Elije tu personaje
              </button>
              <button className="w-full px-3 py-2 text-white bg-transparent border border-turquoise rounded">
                <IonIcon icon={gameController} className="mr-2 text-magenta" />
                Elegir modalidad
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
            <button
              className="w-full px-3 py-2 text-white bg-transparent border border-turquoise rounded mt-4"
              onClick={(e) => handleSubmit(e, body, selectedImage)}
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
