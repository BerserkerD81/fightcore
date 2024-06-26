// src/PostForm.js

import React, { useState } from 'react';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { IonButton, IonContent, IonImg, IonInput, IonModal, IonPage, IonTextarea, IonHeader, IonToolbar, IonTitle, IonButtons, IonIcon, IonItem, IonLabel, IonActionSheet } from '@ionic/react';
import { closeOutline, camera, images, person, gameController } from 'ionicons/icons';

const PostForm = ({ isOpen, onClose }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
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
      console.error('Error selecting image:', error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Title:', title);
    console.log('Description:', description);
    console.log('Image URL:', selectedImage);
    onClose();
  };

  return (
    <IonModal isOpen={isOpen} onDidDismiss={onClose} className="ion-modal-custom">
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton onClick={onClose}>
              <IonIcon icon={closeOutline} />
            </IonButton>
          </IonButtons>
          <IonTitle>Crear publicación</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding ion-content-custom">
        <IonItem>
          <IonLabel position="floating">Título</IonLabel>
          <IonInput value={title} onIonChange={(e) => setTitle(e.detail.value)} required />
        </IonItem>
        <IonItem>
          <IonLabel position="floating">Descripción</IonLabel>
          <IonTextarea value={description} onIonChange={(e) => setDescription(e.detail.value)} required />
        </IonItem>
        <IonButton expand="block" onClick={() => setShowActionSheet(true)}>
          <IonIcon slot="start" icon={camera} />
          Subir Foto
        </IonButton>
        {selectedImage && <IonImg src={selectedImage} alt="Selected" />}
        <div className="post-options">
          <IonButton expand="block">
            <IonIcon slot="start" icon={person} className="custom-icon" />
            Elije tu personaje
          </IonButton>
          <IonButton expand="block">
            <IonIcon slot="start" icon={gameController} className="custom-icon" />
            Elegir modalidad
          </IonButton>
        </div>
        <IonActionSheet
          isOpen={showActionSheet}
          onDidDismiss={() => setShowActionSheet(false)}
          buttons={[
            {
              text: 'Tomar foto',
              icon: camera,
              handler: () => {
                selectImage(CameraSource.Camera);
              },
            },
            {
              text: 'Elegir desde la galería',
              icon: images,
              handler: () => {
                selectImage(CameraSource.Photos);
              },
            },
            {
              text: 'Cancelar',
              role: 'cancel',
            },
          ]}
        />
      </IonContent>
      <IonButton expand="block" type="submit" onClick={handleSubmit}>Crear Post</IonButton>
    </IonModal>
  );
};

export default PostForm;
