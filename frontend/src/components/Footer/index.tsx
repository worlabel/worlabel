import * as React from 'react';
import Modal from './Modal';

export default function Footer() {
  const [modalState, setModalState] = React.useState<'terms' | 'privacy' | null>(null);

  return (
    <footer className="select-none bg-gray-100">
      <div className="container py-8 text-gray-400">
        <div className="body-small flex flex-col items-start gap-5">
          <div>
            <div className="heading">WorLabel</div>
            <span>Copyright © 2024 WorLabel All rights reserved</span>
          </div>
          <div className="inline-flex items-center gap-2">
            <button onClick={() => setModalState('terms')}>서비스 이용약관</button>
            <span className="h-3 w-px rounded bg-gray-400" />
            <button onClick={() => setModalState('privacy')}>개인정보 처리방침</button>
          </div>
        </div>
      </div>
      <Modal
        title="서비스 이용약관"
        content={
          <>
            <p>
              <strong>제1조 목적</strong>
            </p>
            <p>
              이 약관은 WorLabel(이하 "회사")이 제공하는 모든 서비스(이하 "서비스")의 이용과 관련된 사항을 규정하는 것을
              목적으로 합니다.
            </p>
            <br />
            <p>
              <strong>제2조 정의</strong>
            </p>
            <p>
              1. "서비스"란 회사가 제공하는 모든 온라인 콘텐츠와 기능을 의미합니다.
              <br />
              2. "회원"이란 회사의 서비스에 접속하여 본 약관에 동의한 자를 말합니다.
            </p>
            <br />
            <p>
              <strong>제3조 약관의 효력 및 변경</strong>
            </p>
            <p>
              1. 본 약관은 서비스 화면에 공지되며, 회원이 약관에 동의한 시점부터 효력이 발생합니다.
              <br />
              2. 회사는 필요에 따라 본 약관을 변경할 수 있으며, 변경된 약관은 서비스 화면에 공지됩니다.
            </p>
            <br />
            <p>
              <strong>제4조 서비스 이용</strong>
            </p>
            <p>
              1. 회원은 회사가 제공하는 서비스를 본 약관에 따라 이용할 수 있습니다.
              <br />
              2. 회사는 서비스의 운영 또는 기술적 필요에 따라 서비스의 전부 또는 일부를 변경할 수 있습니다.
            </p>
            <br />
            <p>
              <strong>제5조 회원의 의무</strong>
            </p>
            <p>
              1. 회원은 서비스 이용 시 본 약관을 준수해야 하며, 법령을 위반하는 행위를 해서는 안 됩니다.
              <br />
              2. 회원은 타인의 개인정보를 침해하거나, 서비스의 안정적 운영을 방해하는 행위를 해서는 안 됩니다.
            </p>
          </>
        }
        open={modalState === 'terms'}
        onClose={() => setModalState(null)}
      />
      <Modal
        title="개인정보 처리방침"
        content={
          <>
            <p>
              <strong>제1조 수집하는 개인정보의 항목</strong>
            </p>
            <p>
              1. 회사는 서비스 제공을 위해 필요한 최소한의 개인정보를 수집합니다.
              <br />
              2. 수집하는 개인정보 항목은 다음과 같습니다: 이름, 이메일, 서비스 이용 기록, 접속 로그, 쿠키 등.
            </p>
            <br />
            <p>
              <strong>제2조 개인정보의 수집 및 이용 목적</strong>
            </p>
            <p>
              1. 회사는 다음의 목적을 위해 개인정보를 수집 및 이용합니다:
              <br />
              - 회원관리, 서비스 제공, 계약 이행 및 요금 정산.
              <br />
              2. 서비스 개선 및 맞춤형 서비스 제공을 위해 활용될 수 있습니다.
            </p>
            <br />
            <p>
              <strong>제3조 개인정보의 보유 및 이용 기간</strong>
            </p>
            <p>
              1. 회원의 개인정보는 회원 탈퇴 시 지체 없이 파기됩니다.
              <br />
              2. 단, 관계 법령에 따라 일정 기간 보관해야 하는 경우 해당 기간 동안 보유합니다.
            </p>
            <br />
            <p>
              <strong>제4조 개인정보의 제3자 제공</strong>
            </p>
            <p>
              1. 회사는 원칙적으로 회원의 동의 없이 개인정보를 외부에 제공하지 않습니다.
              <br />
              2. 다만, 법령에 의해 요구되는 경우나 회원의 사전 동의를 받은 경우에 한해 제공됩니다.
            </p>
            <br />
            <p>
              <strong>제5조 회원의 권리와 행사 방법</strong>
            </p>
            <p>
              1. 회원은 언제든지 자신의 개인정보를 조회하거나 수정할 수 있으며, 개인정보의 삭제를 요청할 수 있습니다.
              <br />
              2. 회원은 개인정보의 처리에 관한 동의를 철회할 수 있습니다.
            </p>
          </>
        }
        open={modalState === 'privacy'}
        onClose={() => setModalState(null)}
      />
    </footer>
  );
}
