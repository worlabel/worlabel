export default function NotFound() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center">
      <h1 className="animate-weight-loop text-[64px] text-gray-900">페이지를 찾을 수 없습니다.</h1>
      <button
        className="body text-primary hover:underline"
        onClick={() => window.history.back()}
      >
        이전 페이지로 돌아가기
      </button>
    </div>
  );
}
