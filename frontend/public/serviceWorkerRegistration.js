import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.1.3/firebase-app.js';
import { getMessaging, getToken } from 'https://www.gstatic.com/firebasejs/9.1.3/firebase-messaging.js';

const firebaseConfig = {};

const firebaseApp = initializeApp(firebaseConfig);
const messaging = getMessaging(firebaseApp);

const registerServiceWorker = async () => {
  if ('serviceWorker' in navigator) {
    try {
      console.log('Service Worker 등록 중...');
      const firebaseRegistration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
      console.log('Service Worker 등록 성공');

      console.log('Service Worker 활성화 중...');
      const serviceWorker = await navigator.serviceWorker.ready;
      console.log('Service Worker 활성화 성공');

      if (serviceWorker && !sessionStorage.getItem('fcmToken')) {
        const permission = await Notification.requestPermission();

        if (permission === 'granted') {
          console.log('알림 권한이 허용되었습니다.');

          try {
            console.log('FCM 토큰 발급 중...');
            const currentToken = await getToken(messaging, {
              vapidKey: 'BApIruZrx83suCd09dnDCkFSP_Ts08q38trrIL6GHpChtbjQHTHk_38_JRyTiKLqciHxLQ8iXtie3lvgyb4Iphg',
              serviceWorkerRegistration: firebaseRegistration,
            });
            console.log('FCM 토큰 발급 성공');

            if (currentToken) {
              sessionStorage.setItem('fcmToken', currentToken);
            }
          } catch (error) {
            console.warn('FCM 토큰을 가져올 수 없습니다.');
          }

          return;
        }

        console.log('알림 권한이 거부되었습니다.');
      }
    } catch (error) {
      console.error('Service Worker 등록에 실패했습니다. : ', error);
    }

    return;
  }

  console.warn('현재 브라우저에서 Service Worker를 지원하지 않습니다.');
};

registerServiceWorker();
