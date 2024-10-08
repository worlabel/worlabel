import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="select-none bg-gray-100">
      <div className="container py-8 text-gray-400">
        <div className="body-small flex flex-col items-start gap-5">
          <div>
            <div className="heading">WorLabel</div>
            <span>Copyright © 2024 WorLabel. All rights reserved.</span>
          </div>
          <div className="inline-flex items-center gap-2">
            <Link to="#">서비스 이용약관</Link>
            <span className="h-3 w-px rounded bg-gray-400" />
            <Link to="#">개인정보 처리방침</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
