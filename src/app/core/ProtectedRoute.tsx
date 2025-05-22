import { Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

function ProtectedRoute({ children }: ProtectedRouteProps) {
  const token = Cookies.get('jwt_token');

  if (!token) {
    // Если токена нет, перенаправляем на страницу авторизации
    return <Navigate to="/login" replace />;
  }

  // Если токен есть, показываем защищенный контент
  return <>{children}</>;
}

export default ProtectedRoute; 