import { Link } from 'react-router-dom';

export default function HomePage() {
  return (
    <div className="text-center py-12">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">
        팀 대항 게임 시스템
      </h1>
      <p className="text-xl text-gray-600 mb-8">
        MC가 모니터로 진행하는 재미있는 팀 대항전!
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto mb-12">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="text-4xl mb-3">🎵</div>
          <h3 className="text-lg font-semibold mb-2">노래 맞추기</h3>
          <p className="text-gray-600 text-sm">
            YouTube 노래를 듣고 제목과 가수를 맞춰보세요
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="text-4xl mb-3">🎬</div>
          <h3 className="text-lg font-semibold mb-2">드라마/영화 맞추기</h3>
          <p className="text-gray-600 text-sm">
            이미지를 보고 드라마나 영화 제목을 맞춰보세요
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="text-4xl mb-3">⚡</div>
          <h3 className="text-lg font-semibold mb-2">스피드 게임</h3>
          <div className="text-xs text-gray-500">(개발 중)</div>
          <p className="text-gray-600 text-sm">
            2분 안에 유형별 항목을 최대한 많이 맞춰보세요
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="text-4xl mb-3">🤸</div>
          <h3 className="text-lg font-semibold mb-2">동작 게임</h3>
          <div className="text-xs text-gray-500">(개발 중)</div>
          <p className="text-gray-600 text-sm">
            동작을 보고 맞춰보는 재미있는 게임
          </p>
        </div>
      </div>

      <div className="space-x-4">
        <Link
          to="/sessions/new"
          className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
        >
          새 세션 시작하기
        </Link>
        <Link
          to="/sessions"
          className="inline-block bg-gray-200 text-gray-800 px-8 py-3 rounded-lg font-semibold hover:bg-gray-300 transition"
        >
          세션 목록 보기
        </Link>
      </div>
    </div>
  );
}
