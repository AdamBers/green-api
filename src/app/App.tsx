import { Navigate, Route, Routes } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { useSessionStore } from '@/entities/session/store/sessionStore';
import { ROUTE_PATHS } from '@/shared/config/routes';
const ConnectPage = lazy(() => import('@/pages/connect/ConnectPage'));
const MessengerPage = lazy(() => import('@/pages/messenger/MessengerPage'));

function App() {
  const session = useSessionStore((state) => state.session);
  return (
    <Suspense
      fallback={
        <p role="status" className="app-loading">
          Загружаем Green Chat…
        </p>
      }
    >
      <Routes>
        <Route
          path={ROUTE_PATHS.HOME}
          element={session ? <MessengerPage session={session} /> : <ConnectPage />}
        />
        <Route path="*" element={<Navigate to={ROUTE_PATHS.HOME} replace />} />
      </Routes>
    </Suspense>
  );
}
export default App;
