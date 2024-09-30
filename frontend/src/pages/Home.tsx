import { Link } from 'react-router-dom';
import GoogleLogo from '@/assets/icons/web_neutral_rd_ctn@1x.png';
import useAuthStore from '@/stores/useAuthStore';
import { Button } from '@/components/ui/button';

const BASE_URL = import.meta.env.VITE_API_URL;

export default function Home() {
  const { accessToken } = useAuthStore();

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

      {!accessToken ? (
        <a
          href={`${BASE_URL}/login/oauth2/authorization/google`}
          className="mb-4 transition hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-gray-300 active:opacity-80"
        >
          <img
            src={GoogleLogo}
            alt="Sign in with Google"
            className="h-auto w-full"
          />
        </a> // 404 에러 방지
      ) : (
        <>
          <Button
            asChild
            variant="blue"
            size="lg"
          >
            <Link to="/browse">시작하기</Link>
          </Button>
        </>
      )}
    </div>
  );
}
