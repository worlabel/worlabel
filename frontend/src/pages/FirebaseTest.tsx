import { createTestNotification, saveFcmToken } from '@/api/authApi';
import { Button } from '@/components/ui/button';
import { firebaseApp } from '@/firebase';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import { useEffect } from 'react';

export default function FirebaseTest() {
  useEffect(() => {
    const messaging = getMessaging(firebaseApp);

    onMessage(messaging, (payload) => {
      console.log('Message recieved. ', payload);

      if (!payload || !payload.notification) return;

      const { title, body } = payload.notification;

      if (!title || !body) return;

      new Notification(title, { body });
    });
  }, []);

  const getFcmToken = async () => {
    const existingToken = sessionStorage.getItem('fcmToken');

    if (existingToken) {
      console.log(existingToken);
      return existingToken;
    }

    try {
      const permission = await Notification.requestPermission();

      if (permission === 'granted') {
        const messaging = getMessaging(firebaseApp);
        const currentToken = await getToken(messaging, {
          vapidKey: 'BApIruZrx83suCd09dnDCkFSP_Ts08q38trrIL6GHpChtbjQHTHk_38_JRyTiKLqciHxLQ8iXtie3lvgyb4Iphg',
        });

        if (currentToken) {
          console.log(currentToken);
          sessionStorage.setItem('fcmToken', currentToken);
          return currentToken;
        }

        console.warn('FCM 토큰을 가져올 수 없습니다. 권한이 없거나 문제가 발생했습니다.');
        return null;
      }

      console.log('알림 권한이 거부되었습니다.');
      return null;
    } catch (error) {
      console.error('FCM 토큰을 가져오는 중 오류가 발생했습니다.');
      return null;
    }
  };

  const handleSaveToken = () => {
    const fcmToken = sessionStorage.getItem('fcmToken');
    console.log(fcmToken);

    if (fcmToken) {
      saveFcmToken(fcmToken);
    }
  };

  const handleTestNotification = () => {
    createTestNotification();
    console.log('ok');
  };

  return (
    <div>
      <h1 className="heading p-2">hello, firebase!</h1>
      <div className="p-2">
        <Button
          onClick={getFcmToken}
          variant="outlinePrimary"
          className="mr-2"
        >
          getFcmToken
        </Button>
        <Button
          onClick={handleSaveToken}
          variant="outlinePrimary"
          className="mr-2"
        >
          handleSaveToken
        </Button>
        <Button
          onClick={handleTestNotification}
          variant="outlinePrimary"
        >
          handleTestNotification
        </Button>
      </div>
    </div>
  );
}
