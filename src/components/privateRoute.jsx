import { Navigate, useLocation } from 'react-router-dom';
import { useContext, useEffect } from 'react';
import { AuthContext } from '../Context/AuthContext';

const PrivateRoute = ({ children}) => {
  const { user} = useContext(AuthContext);

  const location = useLocation()

  useEffect(() => {
    if (user) {
      // Save the current path in localStorage for redirection
      localStorage.setItem('lastPath', location.pathname + location.search);
    }
  }, [location, user]);

  return user ? children : <Navigate to="/login"/>
};

export default PrivateRoute;
