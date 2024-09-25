// import { initializeApp } from 'firebase/app';
// import { getMessaging, getToken } from 'firebase/messaging';

// const firebaseConfig = {
//   apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
//   authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
//   projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
//   storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
//   messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
//   appId: import.meta.env.VITE_FIREBASE_APP_ID,
//   measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
// };

// export const app = initializeApp(firebaseConfig);
// export const messaging = getMessaging(app);

// export async function registerServiceWorker() {
//   if ('serviceWorker' in navigator) {
//     try {
//       console.log('서비스 워커 등록 시도 중...');

//       const firebaseRegistration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');

//       console.log('Firebase Service Worker 등록 성공');
//       console.log('서비스 워커 활성화 대기 중...');

//       const serviceWorker = await navigator.serviceWorker.ready;

//       console.log('서비스 워커 활성화');

//       if (serviceWorker && !sessionStorage.getItem('fcmToken')) {
//         console.log('세션 체크 중...');

//         const permission = await Notification.requestPermission();
//         if (permission === 'granted') {
//           console.log('알림 권한 허용됨');

//           const currentToken = await getToken(messaging, {
//             vapidKey: 'BApIruZrx83suCd09dnDCkFSP_Ts08q38trrIL6GHpChtbjQHTHk_38_JRyTiKLqciHxLQ8iXtie3lvgyb4Iphg',
//             serviceWorkerRegistration: firebaseRegistration,
//           });
//           if (currentToken) {
//             sessionStorage.setItem('fcmToken', currentToken);
//           } else {
//             console.warn('FCM 토큰을 가져올 수 없습니다. 권한이 없거나 문제가 발생했습니다.');
//           }
//         } else {
//           console.log('알림 권한이 거부되었습니다.');
//         }
//       }
//     } catch (error) {
//       console.error('Service Worker 등록 실패:', error);
//     }
//   } else {
//     console.warn('Service Worker not supported in this browser');
//   }
// }
