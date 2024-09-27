import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: String(import.meta.env.VITE_FIREBASE_API_KEY),
  authDomain: String(import.meta.env.VITE_FIREBASE_AUTH_DOMAIN),
  projectId: String(import.meta.env.VITE_FIREBASE_PROJECT_ID),
  storageBucket: String(import.meta.env.VITE_FIREBASE_STORAGE_BUCKET),
  messagingSenderId: String(import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID),
  appId: String(import.meta.env.VITE_FIREBASE_APP_ID),
  measurementId: String(import.meta.env.VITE_FIREBASE_MEASUREMENT_ID),
};

const firebaseApp = initializeApp(firebaseConfig);
const messaging = getMessaging(firebaseApp);

const getFcmToken = async () => {
  const existingToken = sessionStorage.getItem('fcmToken');

  if (existingToken) {
    // 이미 토큰이 있는 경우, 해당 토큰을 반환한다.
    return existingToken;
  }

  try {
    const permission = await Notification.requestPermission();

    if (permission === 'granted') {
      console.log('알림 권한이 허용되었습니다.');

      console.log('FCM 토큰 발급 중...');
      const currentToken = await getToken(messaging, {
        vapidKey: 'BApIruZrx83suCd09dnDCkFSP_Ts08q38trrIL6GHpChtbjQHTHk_38_JRyTiKLqciHxLQ8iXtie3lvgyb4Iphg',
      });
      console.log('FCM 토큰 발급 성공');

      if (currentToken) {
        sessionStorage.setItem('fcmToken', currentToken);
        return currentToken;
      }

      console.warn('FCM 토큰을 가져올 수 없습니다.');
    } else {
      console.log('알림 권한이 거부되었습니다.');
    }
  } catch (error) {
    console.error('FCM 토큰을 가져오는 중 오류가 발생했습니다. : ', error);
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
