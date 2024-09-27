import { createFcmNotification, saveFcmToken } from '@/api/authApi';
import { handleForegroundMessages } from '@/api/firebaseConfig';
import { Button } from '@/components/ui/button';

export default function FirebaseTest() {
  const handleSaveFcmToken = async () => {
    await saveFcmToken();
  };

  const handleCreateNotification = async () => {
    await createFcmNotification();
  };

  handleSaveFcmToken();
  handleForegroundMessages();

  return (
    <div>
      <h1 className="heading p-2">hello, firebase!</h1>
      <div className="p-2">
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
