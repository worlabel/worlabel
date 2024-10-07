import { Link } from 'react-router-dom';
import GoogleLogo from '@/assets/icons/web_light_rd_ctn@1x.png';
import useAuthStore from '@/stores/useAuthStore';
import { Button } from '@/components/ui/button';

const BASE_URL = import.meta.env.VITE_API_URL;

export default function Home() {
  const { accessToken } = useAuthStore();

  return (
    <div className="flex h-full w-full flex-col items-center justify-center bg-gray-50">
      <div className="text-center">
        <p className="text-5xl font-semibold leading-[60px] text-black">
          <span className="text-primary">Worlabel</span>에 오신 것을 환영합니다
          <br />
          <span className="text-primary">웹 기반 오토 레이블링</span> 플랫폼
        </p>
      </div>
      <div className="mt-4 text-center">
        <p className="text-xl font-light leading-[28px] text-black">
          Worlabel로 레이블링 작업을 간소화하세요.
          <br />
          브라우저에서 직접 레이블링을 자동화하여 빠르고 효율적인 워크플로우를 경험하세요.
        </p>
      </div>

      <div className="mt-8">
        {!accessToken ? (
          <a
            href={`${BASE_URL}/login/oauth2/authorization/google`}
            className="flex items-center justify-center transition hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-gray-300 active:opacity-80"
          >
            <img
              src={GoogleLogo}
              alt="Sign in with Google"
              className="h-auto w-full"
            />
          </a>
        ) : (
          <Button
            asChild
            variant="blue"
            size="lg"
            className="mt-8"
          >
            <Link to="/browse">시작하기</Link>
          </Button>
        )}
      </div>
    </div>
  );
}
