// src/PostForm.js

import React, { useState } from 'react';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { IonButton, IonContent, IonImg, IonInput, IonModal, IonPage, IonTextarea, IonHeader, IonToolbar, IonTitle, IonButtons, IonIcon, IonItem, IonLabel } from '@ionic/react';
import { closeOutline, camera, person, gameController } from 'ionicons/icons';

const PostForm = ({ isOpen, onClose }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const selectImage = async () => {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.Uri,
        source: CameraSource.Photos,
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
    <IonModal isOpen={isOpen} onDidDismiss={onClose}>
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
      <IonContent className="ion-padding">
        <IonItem>
          <IonLabel position="floating">Título</IonLabel>
          <IonInput value={title} onIonChange={(e) => setTitle(e.detail.value)} required />
        </IonItem>
        <IonItem>
          <IonLabel position="floating">Descripción</IonLabel>
          <IonTextarea value={description} onIonChange={(e) => setDescription(e.detail.value)} required />
        </IonItem>
        <IonButton expand="block" onClick={selectImage}>
          <IonIcon slot="start" icon={camera} />
          Subir Foto
        </IonButton>
        {selectedImage && <IonImg src={selectedImage} alt="Selected" />}
        <IonButton expand="block">
          <IonIcon slot="start" icon={person} />
          Elije tu personaje
        </IonButton>
        <IonButton expand="block">
          <IonIcon slot="start" icon={gameController} />
          Elegir juego
        </IonButton>
        <IonButton expand="block" type="submit" onClick={handleSubmit}>Crear Post</IonButton>
      </IonContent>
    </IonModal>
  );
};

export default PostForm;
