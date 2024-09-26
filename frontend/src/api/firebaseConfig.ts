import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

const firebaseApp = initializeApp(firebaseConfig);
const messaging = getMessaging(firebaseApp);

const getFcmToken = async () => {
  const existingToken = sessionStorage.getItem('fcmToken');

  if (existingToken) {
    return existingToken; // 이미 토큰이 있는 경우, 해당 토큰을 반환한다.
  }

  try {
    const permission = await Notification.requestPermission();

    if (permission === 'granted') {
      const currentToken = await getToken(messaging, {
        vapidKey: 'BGVbiPhLWWxijrc2jfn9lTyDs-kcSfSinb2bUmEoDXSc8ljx6sWtur9k82vmjBLND06SSeb10oq-rw7zmzrpoPY',
      });

      if (currentToken) {
        sessionStorage.setItem('fcmToken', currentToken);
        return currentToken;
      }

      console.warn('FCM 토큰을 가져올 수 없습니다.');
      return null;
    }

    console.log('알림 권한이 거부되었습니다.');
    return null;
  } catch (error) {
    console.error('FCM 토큰을 가져오는 중 오류가 발생했습니다 : ', error);
    return null;
  }
};

const handleForegroundMessages = () => {
  onMessage(messaging, (payload) => {
    console.log('onMessage');
    console.log(payload);

    if (!payload.data) return;

    console.log(payload.data);
  });
};

export { getFcmToken, handleForegroundMessages, messaging };
