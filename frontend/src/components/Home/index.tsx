import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue, SelectGroup } from '../ui/select';
import GoogleLogo from '@/assets/icons/web_neutral_rd_ctn@1x.png';

interface HomeProps {
  isLoggedIn?: boolean;
  setIsLoggedIn?: (loggedIn: boolean) => void;
}

export default function Home({ isLoggedIn = false, setIsLoggedIn }: HomeProps) {
  const [, setSelectedWorkspace] = useState('');
  const [loggedIn, setLoggedIn] = useState(isLoggedIn);
  const navigate = useNavigate();

  const workspaces = [
    { id: 1, name: 'Workspace 1' },
    { id: 2, name: 'Workspace 2' },
    { id: 3, name: 'Workspace 3' },
  ];

  const handleGoogleSignIn = () => {
    console.log('구글로 계속하기');
    setLoggedIn(true);
    if (setIsLoggedIn) {
      setIsLoggedIn(true);
    }
  };

  const handleWorkspaceSelect = (value: string) => {
    const selected = workspaces.find((workspace) => workspace.name === value);
    if (selected) {
      navigate(`/browse/${selected.id}`);
    }
    setSelectedWorkspace(value);
  };

  return (
    <div className="flex h-full flex-col items-center justify-center bg-gray-50 p-8">
      <div className="mb-6 max-w-xl rounded-lg bg-white p-6 shadow-lg">
        <h2 className="mb-4 text-2xl font-bold text-gray-900">서비스 설명</h2>
        <p className="mb-4 text-base text-gray-700">
          본 서비스는 인공 지능(AI) 모델의 학습을 지원하기 위해 웹 기반의 자동 라벨링 도구를 개발하는 것을 목표로
          합니다. 이 도구는 이미지나 텍스트와 같은 비정형 데이터에 레이블을 자동으로 부여하는 기능을 제공합니다.
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

      {!loggedIn ? (
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
        <Select onValueChange={handleWorkspaceSelect}>
          <SelectTrigger className="mb-4 w-72">
            <SelectValue placeholder="워크스페이스를 선택하세요" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {workspaces.map((workspace) => (
                <SelectItem
                  key={workspace.id}
                  value={workspace.name}
                >
                  {workspace.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      )}
    </div>
  );
}
