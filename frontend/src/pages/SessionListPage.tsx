import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { sessionsApi } from '../api';
import type { Session } from '../types';

export default function SessionListPage() {
  const { data: sessions, isLoading, error } = useQuery<Session[]>({
    queryKey: ['sessions'],
    queryFn: sessionsApi.getAll,
  });

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="text-xl text-gray-600">로딩 중...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-xl text-red-600">
          세션을 불러오는데 실패했습니다.
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">세션 목록</h1>
        <Link
          to="/sessions/new"
          className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
        >
          + 새 세션 만들기
        </Link>
      </div>

      {sessions && sessions.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-gray-600 mb-4">아직 생성된 세션이 없습니다.</p>
          <Link
            to="/sessions/new"
            className="text-blue-600 hover:text-blue-700 font-semibold"
          >
            첫 세션 만들기 →
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sessions?.map((session) => (
            <Link
              key={session.id}
              to={`/sessions/${session.id}`}
              className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition"
            >
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-xl font-semibold text-gray-900">
                  {session.sessionName}
                </h3>
                <span
                  className={`px-2 py-1 text-xs rounded-full ${
                    session.status === '준비중'
                      ? 'bg-yellow-100 text-yellow-800'
                      : session.status === '진행중'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {session.status}
                </span>
              </div>
              <div className="space-y-2 text-sm text-gray-600">
                <p>
                  <span className="font-medium">MC:</span> {session.mcName}
                </p>
                <p>
                  <span className="font-medium">참가자:</span>{' '}
                  {session.totalParticipants}명
                </p>
                <p>
                  <span className="font-medium">날짜:</span>{' '}
                  {new Date(session.sessionDate).toLocaleDateString('ko-KR')}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
