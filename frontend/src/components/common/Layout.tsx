import { Outlet, Link } from 'react-router-dom';

export default function Layout() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link to="/" className="text-2xl font-bold text-blue-600">
              🎮 팀 대항 게임 시스템
            </Link>
            <nav className="flex space-x-4">
              <Link
                to="/"
                className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md"
              >
                홈
              </Link>
              <Link
                to="/sessions"
                className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md"
              >
                세션 관리
              </Link>
              <Link
                to="/content"
                className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md"
              >
                콘텐츠 관리
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <p className="text-center text-gray-500 text-sm">
            © 2024 Team Game System. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
