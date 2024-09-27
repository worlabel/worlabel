/* eslint-disable no-undef */
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.1.3/firebase-app.js';
import { getMessaging, getToken } from 'https://www.gstatic.com/firebasejs/9.1.3/firebase-messaging.js';

const firebaseConfig = {
  apiKey: 'AIzaSyBQx50AsrS3K687cGbFDh1908ClCLFmnhA',
  authDomain: 'worlabel-6de69.firebaseapp.com',
  projectId: 'worlabel-6de69',
  storageBucket: 'worlabel-6de69.appspot.com',
  messagingSenderId: '124097400880',
  appId: '1:124097400880:web:022db3cdc0bdea750c5df5',
  measurementId: 'G-KW02YRYF5H',
};

const firebaseApp = initializeApp(firebaseConfig);
const messaging = getMessaging(firebaseApp);

const registerServiceWorker = async () => {
  if (!('serviceWorker' in navigator)) {
    console.warn('현재 브라우저에서 서비스 워커를 지원하지 않습니다.');
    return;
  }

  try {
    console.log('FCM 서비스 워커 등록 중...');
    const firebaseRegistration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
    console.log('FCM 서비스 워커 등록 성공');

    console.log('FCM 서비스 워커 활성화 중...');
    const serviceWorker = await navigator.serviceWorker.ready;
    console.log('FCM 서비스 워커 활성화 성공');

    if (serviceWorker && !sessionStorage.getItem('fcmToken')) {
      const permission = await Notification.requestPermission();

      if (permission === 'granted') {
        console.log('알림 권한이 허용되었습니다.');

        console.log('FCM 토큰 발급 중...');
        const currentToken = await getToken(messaging, {
          vapidKey: 'BApIruZrx83suCd09dnDCkFSP_Ts08q38trrIL6GHpChtbjQHTHk_38_JRyTiKLqciHxLQ8iXtie3lvgyb4Iphg',
          serviceWorkerRegistration: firebaseRegistration,
        });
        console.log('FCM 토큰 발급 성공');

        if (currentToken) {
          sessionStorage.setItem('fcmToken', currentToken);
        } else {
          console.warn('FCM 토큰을 가져올 수 없습니다.');
        }
      } else {
        console.log('알림 권한이 거부되었습니다.');
      }
    }
  } catch (error) {
    console.error('FCM 서비스 워커 등록에 실패했습니다. : ', error);
  }
};

// 서비스 워커 등록 함수 호출
registerServiceWorker();
