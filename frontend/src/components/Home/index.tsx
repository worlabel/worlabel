import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import GoogleLogo from '@/assets/icons/web_neutral_rd_ctn@1x.png';
import useAuthStore from '@/stores/useAuthStore';
import { Button } from '@/components/ui/button';
import { fetchProfileApi, reissueTokenApi } from '@/api/authApi';

const DOMAIN = 'https://j11s002.p.ssafy.io';

export default function Home() {
  const navigate = useNavigate();
  const { isLoggedIn, setLoggedIn, profile, setProfile } = useAuthStore();
  const hasFetchedProfile = useRef(false);

  if (!isLoggedIn && !profile.id && !hasFetchedProfile.current) {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      setLoggedIn(true, accessToken);
      fetchProfileApi()
        .then((data) => {
          if (data?.isSuccess && data.data) {
            setProfile({
              id: data.data.id,
              nickname: data.data.nickname,
              profileImage: data.data.profileImage,
            });
            hasFetchedProfile.current = true;
          }
        })
        .catch((error) => {
          alert('프로필을 가져오는 중 오류가 발생했습니다. 다시 시도해주세요.');
          console.error('프로필 가져오기 실패:', error);
        });
    }
  }

  const handleGoogleSignIn = () => {
    window.location.href = `${DOMAIN}/api/login/oauth2/authorization/google`;
  };

  const handleStart = () => {
    navigate('/browse');
  };

  const handleReissueToken = async () => {
    try {
      const response = await reissueTokenApi();
      console.log('토큰 재발급 성공:', response);
      alert('토큰 재발급 성공! 새로운 액세스 토큰을 콘솔에서 확인하세요.');
    } catch (error) {
      console.error('토큰 재발급 실패:', error);
      alert('토큰 재발급에 실패했습니다. 다시 시도해 주세요.');
    }
  };

  const isHidden = true;

  return (
    <div className="flex h-full flex-col items-center justify-center bg-gray-50 p-8">
      <div className="mb-6 max-w-xl rounded-lg bg-white p-6 shadow-lg">
        <h2 className="mb-4 text-2xl font-bold text-gray-900">서비스 설명</h2>
        <p className="mb-4 text-base text-gray-700">
          본 서비스는 인공 지능(AI) 모델의 학습을 지원하기 위해 웹 기반의 자동 라벨링 도구를 개발하는 것을 목표로
          합니다.
        </p>
        <p className="mb-4 text-base text-gray-700">
          기존의 수동적인 방법으로는 대량의 학습 데이터를 처리하는데 시간과 비용이 많이 소모되었습니다. 그러나 본
          서비스의 결과물인 Auto Labeler를 사용하면, 이러한 문제를 해결할 수 있을 것으로 기대됩니다.
        </p>
        <p className="mb-4 text-base text-gray-700">
          Auto Labeler는 웹 기반으로 동작하므로, 별도의 설치 과정 없이 인터넷 연결 환경에서 쉽게 사용할 수 있습니다.
          또한, 사용자 친화적인 인터페이스를 제공하여 비전문가도 손쉽게 이용할 수 있도록 설계될 예정입니다.
        </p>
        <p className="text-base text-gray-700">
          본 서비스는 특히 학습 데이터 구축 과정의 효율성과 정확도를 향상시키는 데 중점을 두고 있습니다.
        </p>
      </div>

      {!isLoggedIn ? (
        <button
          onClick={handleGoogleSignIn}
          className="mb-4 transition hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-gray-300 active:opacity-80"
        >
          <img
            src={GoogleLogo}
            alt="Sign in with Google"
            className="h-auto w-full"
          />
        </button>
      ) : (
        <>
          <Button
            variant="outlinePrimary"
            size="lg"
            onClick={handleStart}
          >
            시작하기
          </Button>
          <Button
            variant="outlinePrimary"
            size="lg"
            onClick={handleReissueToken}
            className="mt-4"
            style={{ display: isHidden ? 'none' : 'block' }}
          >
            리프레시 토큰 재발급 테스트
          </Button>
        </>
      )}
    </div>
  );
}
