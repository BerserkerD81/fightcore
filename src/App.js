// src/App.js

import React, { useState } from 'react';
import { setupIonicReact } from '@ionic/react';
import { IonApp, IonButton, IonContent, IonPage, IonFooter, IonToolbar, IonButtons, IonIcon } from '@ionic/react';
import PostForm from './formArchivo';
import './App.css';
import { addCircle, home, search, person } from 'ionicons/icons';

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

setupIonicReact();

const App = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <IonApp>
      <IonPage>
        <IonContent className="ion-padding">
          <IonButton expand="block" onClick={openModal}>
            <IonIcon slot="start" icon={addCircle} />
            Crear Nueva Publicación
          </IonButton>
          <PostForm isOpen={isModalOpen} onClose={closeModal} />
        </IonContent>
        <IonFooter>
          <IonToolbar>
            <IonButtons slot="start">
              <IonButton>
                <IonIcon icon={home} />
              </IonButton>
              <IonButton>
                <IonIcon icon={search} />
              </IonButton>
              <IonButton>
                <IonIcon icon={addCircle} />
              </IonButton>
              <IonButton>
                <IonIcon icon={person} />
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonFooter>
      </IonPage>
    </IonApp>
  );
};

export default App;
