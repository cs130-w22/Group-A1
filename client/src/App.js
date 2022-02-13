import React, { useState, useMemo } from 'react';
import { Route, Routes } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import { Watch } from 'react-loader-spinner';
import Home from './components/Home';
import NotFound from './components/NotFound';
import Login from './components/Login';
import Create from './components/Create';

import Signup from './components/Signup';
import { Navigation } from './Navigation';
import { UserContext } from './utils/userContext';
import { apiInstance } from './utils/axiosInstance';
import useLocalStorage from './utils/localStorage';
import EventPage from './components/EventPage';

function App() {
  const [user, setUser] = useLocalStorage('user', null);
  const [isLoading, setIsLoading] = useState(false);

  const logout = () => {
    setIsLoading(true);
    return new Promise((resolve, reject) => {
      apiInstance.post('/logout').then(() => {
        setUser(null);
        localStorage.clear();
        console.log('Logged out');
        setIsLoading(false);
        resolve();
      }).catch((err) => {
        console.log(err);
        reject();
      });
    });
  };

  const contextProvider = useMemo(() => ({ user, setUser }), [user, setUser]);
  return (
    <UserContext.Provider value={contextProvider}>
      <Navigation onLogout={logout} />
      <Container className="pt-3 h-100">
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
            <Route path="/event/create" element={<Create />} />
            <Route path="/event/:id" element={<EventPage />} />
            <Route path="/" element={<Home />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        )}
      </Container>
    </UserContext.Provider>
  );
}

export default App;
