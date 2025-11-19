import { createBrowserRouter } from 'react-router-dom';
import Layout from '../components/common/Layout';
import HomePage from '../pages/HomePage';
import SessionListPage from '../pages/SessionListPage';
import SessionDetailPage from '../pages/SessionDetailPage';
import CreateSessionPage from '../pages/CreateSessionPage';
import GamePlayPage from '../pages/GamePlayPage';
import ContentManagementPage from '../pages/content/ContentManagementPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'sessions',
        element: <SessionListPage />,
      },
      {
        path: 'sessions/new',
        element: <CreateSessionPage />,
      },
      {
        path: 'sessions/:id',
        element: <SessionDetailPage />,
      },
      {
        path: 'sessions/:sessionId/games/:gameId',
        element: <GamePlayPage />,
      },
      {
        path: 'content',
        element: <ContentManagementPage />,
      },
    ],
  },
]);
