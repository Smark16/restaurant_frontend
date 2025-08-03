import { Navigate, useLocation } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../Context/AuthContext';

const PrivateRoute = ({ children }) => {
  const { user } = useContext(AuthContext);
  const location = useLocation();

  // Only save path if not authenticated
  if (!user) {
    const pathToSave = location.pathname + location.search;
    localStorage.setItem('lastPath', pathToSave);
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default PrivateRoute;
