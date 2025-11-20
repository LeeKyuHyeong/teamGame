import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { sessionsApi, teamsApi, participantsApi } from '../api';
import { type CreateSessionDto, TeamType } from '../types';

export default function CreateSessionPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [sessionName, setSessionName] = useState('');
  const [mcName, setMcName] = useState('');
  const [totalParticipants, setTotalParticipants] = useState(14);
  
  const [teamAParticipants, setTeamAParticipants] = useState<string[]>(['']);
  const [teamBParticipants, setTeamBParticipants] = useState<string[]>(['']);

  const createSessionMutation = useMutation({
    mutationFn: sessionsApi.create,
    onSuccess: async (session) => {
      // A팀 생성
      const teamA = await teamsApi.create({
        sessionId: Number(session.id),
        teamName: 'A팀',
        teamType: TeamType.MALE,
      });

      // B팀 생성
      const teamB = await teamsApi.create({
        sessionId: Number(session.id),
        teamName: 'B팀',
        teamType: TeamType.FEMALE,
      });

      // A팀 참가자 추가
      const teamAData = teamAParticipants
        .filter((name) => name.trim())
        .map((name) => ({
          teamId: Number(teamA.id),
          participantName: name.trim(),
        }));
      
      if (teamAData.length > 0) {
        await participantsApi.createBatch(teamAData);
      }

      // B팀 참가자 추가
      const teamBData = teamBParticipants
        .filter((name) => name.trim())
        .map((name) => ({
          teamId: Number(teamB.id),
          participantName: name.trim(),
        }));
      
      if (teamBData.length > 0) {
        await participantsApi.createBatch(teamBData);
      }

      // MC 추가
      if (mcName.trim()) {
        await participantsApi.create({
          teamId: Number(teamA.id),
          participantName: mcName.trim(),
          isMc: true,
        });
      }

      queryClient.invalidateQueries({ queryKey: ['sessions'] });
      navigate('/sessions/');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const data: CreateSessionDto = {
      sessionName,
      mcName,
      totalParticipants,
    };

    createSessionMutation.mutate(data);
  };

  const addParticipantField = (team: 'A' | 'B') => {
    if (team === 'A') {
      setTeamAParticipants([...teamAParticipants, '']);
    } else {
      setTeamBParticipants([...teamBParticipants, '']);
    }
  };

  const updateParticipant = (team: 'A' | 'B', index: number, value: string) => {
    if (team === 'A') {
      const updated = [...teamAParticipants];
      updated[index] = value;
      setTeamAParticipants(updated);
    } else {
      const updated = [...teamBParticipants];
      updated[index] = value;
      setTeamBParticipants(updated);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">새 세션 만들기</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 기본 정보 */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">기본 정보</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                세션 이름 *
              </label>
              <input
                type="text"
                value={sessionName}
                onChange={(e) => setSessionName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
                placeholder="예: 2024 송년회"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                MC 이름
              </label>
              <input
                type="text"
                value={mcName}
                onChange={(e) => setMcName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="예: 김진행"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                총 참가자 수
              </label>
              <input
                type="number"
                value={totalParticipants}
                onChange={(e) => setTotalParticipants(parseInt(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="2"
              />
            </div>
          </div>
        </div>

        {/* 팀 구성 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* A팀 */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4 text-blue-600">
              A팀 (남성)
            </h3>
            <div className="space-y-2">
              {teamAParticipants.map((name, index) => (
                <input
                  key={index}
                  type="text"
                  value={name}
                  onChange={(e) => updateParticipant('A', index, e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder={`참가자 ${index + 1}`}
                />
              ))}
              <button
                type="button"
                onClick={() => addParticipantField('A')}
                className="w-full px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-500 hover:text-blue-500 transition"
              >
                + 참가자 추가
              </button>
            </div>
          </div>

          {/* B팀 */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4 text-pink-600">
              B팀 (여성)
            </h3>
            <div className="space-y-2">
              {teamBParticipants.map((name, index) => (
                <input
                  key={index}
                  type="text"
                  value={name}
                  onChange={(e) => updateParticipant('B', index, e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  placeholder={`참가자 ${index + 1}`}
                />
              ))}
              <button
                type="button"
                onClick={() => addParticipantField('B')}
                className="w-full px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-pink-500 hover:text-pink-500 transition"
              >
                + 참가자 추가
              </button>
            </div>
          </div>
        </div>

        {/* 제출 버튼 */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/sessions')}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
          >
            취소
          </button>
          <button
            type="submit"
            disabled={createSessionMutation.isPending}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
          >
            {createSessionMutation.isPending ? '생성 중...' : '세션 생성'}
          </button>
        </div>
      </form>
    </div>
  );
}
