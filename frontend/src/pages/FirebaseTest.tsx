import { createTestNotification, saveFcmToken } from '@/api/authApi';
import { Button } from '@/components/ui/button';
import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

export default function FirebaseTest() {
  const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
  };

  const app = initializeApp(firebaseConfig);
  const messaging = getMessaging(app);

  onMessage(messaging, (payload) => {
    console.log('Message recieved. ', payload);

    if (!payload || !payload.notification) return;

    // 메시지 내용에 따라 사용자에게 알림을 표시할 수 있습니다.
    const { title, body } = payload.notification;

    if (!title || !body) return;

    new Notification(title, { body });
  });

  const getFcmToken = async () => {
    const permission = await Notification.requestPermission();

    if (permission === 'granted') {
      const currentToken = await getToken(messaging, {
        vapidKey: 'BApIruZrx83suCd09dnDCkFSP_Ts08q38trrIL6GHpChtbjQHTHk_38_JRyTiKLqciHxLQ8iXtie3lvgyb4Iphg',
      });

      if (currentToken) {
        sessionStorage.setItem('fcmToken', currentToken);
        console.log(currentToken);
      } else {
        console.warn('FCM 토큰을 가져올 수 없습니다. 권한이 없거나 문제가 발생했습니다.');
      }
    } else {
      console.log('알림 권한이 거부되었습니다.');
    }

    return null;
  };

  const handleSaveToken = () => {
    const fcmToken = sessionStorage.getItem('fcmToken');

    if (fcmToken) {
      saveFcmToken(fcmToken);
      console.log(fcmToken);
    }
  };

  const handleTest = () => {
    createTestNotification();
    console.log('ok');
  };

  getFcmToken();

  return (
    <div>
      <h1 className="heading p-2">hello, firebase!</h1>
      <div className="p-2">
        <Button
          onClick={handleSaveToken}
          variant="outlinePrimary"
          className="mr-2"
        >
          handleSaveToken
        </Button>
        <Button
          onClick={handleTest}
          variant="outlinePrimary"
        >
          handleTest
        </Button>
      </div>
    </div>
  );
}
