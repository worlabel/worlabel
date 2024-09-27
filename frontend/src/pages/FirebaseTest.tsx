import { createFcmNotification, saveFcmToken } from '@/api/authApi';
import { getFcmToken, handleForegroundMessages } from '@/api/firebaseConfig';
import { Button } from '@/components/ui/button';

export default function FirebaseTest() {
  const handleSaveFcmToken = async () => {
    const fcmToken = await getFcmToken();

    if (fcmToken) {
      console.log(fcmToken);
      await saveFcmToken(fcmToken);
      return;
    }

    console.log('FCM 토큰이 없습니다.');
  };

  const handleCreateNotification = async () => {
    await createFcmNotification();
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
          FCM 토큰 서버에 저장
        </Button>
        <Button
          onClick={handleCreateNotification}
          variant="outlinePrimary"
          className="mr-2"
        >
          FCM 알림 테스트
        </Button>
      </div>
    </div>
  );
}
