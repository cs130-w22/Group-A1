import React, {
  useState, useMemo, useCallback, useContext,
} from 'react';
import {
  Navigate, Outlet, Route, Routes, useLocation,
} from 'react-router-dom';
import { Container } from 'react-bootstrap';
import { Watch } from 'react-loader-spinner';
import Home from './components/Home';
import NotFound from './components/NotFound';
import Login from './components/Login';
import Create from './components/Create';

import Signup from './components/Signup';
import { Navigation } from './Navigation';
import { UserContext } from './utils/context';
import { apiInstance } from './utils/axiosInstance';
import useLocalStorage from './utils/localStorage';
import EventPage from './components/EventPage';

function AuthRoute() {
  const { user } = useContext(UserContext);
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return <Outlet />;
}

function App() {
  const [user, setUser] = useLocalStorage('user', null);
  const [isLoading, setIsLoading] = useState(false);

  const logout = useCallback(() => {
    setIsLoading(true);
    return new Promise((resolve, reject) => {
      apiInstance.post('/logout').then(() => {
        setUser(null);
        localStorage.clear();
        console.log('Logged out');
        setIsLoading(false);
        resolve();
      }).catch((err) => {
        setUser(null);
        localStorage.clear();
        setIsLoading(false);
        console.log(err);
        reject();
      });
    });
  }, [setUser]);

  const contextProvider = useMemo(() => ({ user, setUser, logout }), [user, setUser, logout]);
  return (
    <UserContext.Provider value={contextProvider}>
      <Navigation onLogout={logout} />
      <Container className="pt-3 h-100 pb-5">
        {(isLoading) ? (
          <Watch
            heigth="100"
            width="100"
            color="grey"
            ariaLabel="loading"
          />
        ) : (
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route element={<AuthRoute />}>
              <Route path="/" element={<Home />} />
              <Route path="/event/create" element={<Create />} />
              <Route path="/event/:id" element={<EventPage />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        )}
      </Container>
    </UserContext.Provider>
  );
}

export default App;
