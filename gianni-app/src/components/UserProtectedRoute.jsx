import { Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

const UserProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem('userToken');
      
      if (!token) {
        setIsAuthenticated(false);
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/user/verify`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        setIsAuthenticated(response.ok);
      } catch (error) {
        setIsAuthenticated(false);
      }
      setIsLoading(false);
    };

    verifyToken();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default UserProtectedRoute;
