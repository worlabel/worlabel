import { createFcmNotification, saveFcmToken } from '@/api/authApi';
import { getFcmToken, handleForegroundMessages } from '@/api/firebaseConfig';
import { Button } from '@/components/ui/button';

export default function FirebaseTest() {
  const handleSaveFcmToken = async () => {
    const fcmToken = await getFcmToken();

    if (fcmToken) {
      await saveFcmToken(fcmToken);
      console.log(fcmToken);
      return;
    }

    console.log('저장된 FCM token이 없습니다.');
  };

  const handleTestNotification = async () => {
    await createFcmNotification()
      .then(() => {
        console.log('테스트 알림에 성공했습니다.');
      })
      .catch(() => {
        console.log('테스트 알림에 실패했습니다.');
      });
  };

  handleForegroundMessages();

  return (
    <div>
      <h1 className="heading p-2">hello, firebase!</h1>
      <div className="p-2">
        <Button
          onClick={handleSaveFcmToken}
          variant="outlinePrimary"
          className="mr-2"
        >
          FCM 토큰 불러와서 redis에 저장
        </Button>
        <Button
          onClick={handleTestNotification}
          variant="outlinePrimary"
          className="mr-2"
        >
          FCM 알림 테스트
        </Button>
      </div>
    </div>
  );
}
