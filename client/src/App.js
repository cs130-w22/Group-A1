import React, { useEffect, useState } from 'react';
import { Route, Routes } from "react-router-dom";
import Home from './components/Home';
import NotFound from './components/NotFound';
import { Container } from 'react-bootstrap'
import Login from './components/Login';
import Signup from './components/Signup';
import { Navigation } from './Navigation';
import { UserContext, UserDispatchContext } from './utils/userContext';
import { apiInstance } from './utils/axiosInstance';
import Cookies from 'universal-cookie';
import { Watch } from 'react-loader-spinner';
import { getCookie } from './api/auth';

const cookies = new Cookies();
function App() {
    const [user, setUser] = useState(null);
    const [loggingOut, setLoggingOut] = useState(false);
    const [loggingIn, setLoggingIn] = useState(false);

    const login = (userId) => {
        setLoggingIn(true);
        return new Promise((resolve) => {
            getCookie().then((res) => {
                const userCookie = cookies.get('user');
                if (userCookie) {
                    setUser(userCookie);
                }
                resolve();
                setLoggingIn(false);
            })
        });
    }
    const logout = () => {
        setLoggingOut(true);
        cookies.remove('user');
        return new Promise((resolve, reject) => {
            apiInstance.post('/logout').then((res) => {
                setUser(null);
                sessionStorage.clear();
                console.log("Logged out")
                setLoggingOut(false);
                resolve();
            }).catch((err) => {
                console.log(err);
                reject();
            })
        });
    }
    const getUser = () => {
        const userId = cookies.get('user');
        if (userId && userId !== user?.id) {
            setUser(userId);
        } else {
            getCookie().then((res) => {
                const userCookie = cookies.get('user');
                if (userCookie) {
                    setUser(userCookie);
                }
            })
        }
    }
    useEffect(() => {
        if (!user && !loggingOut && !loggingIn) getUser();
    });
    return (
        <UserContext.Provider value={user}>
            <UserDispatchContext.Provider value={{ loginDispatcher: login, logoutDispatcher: logout }}>
                <Navigation />
                <Container className="pt-3 h-100">
                    {(loggingIn || loggingOut) ? (
                        <Watch
                            heigth="100"
                            width="100"
                            color='grey'
                            ariaLabel='loading'
                        />) : (
                        <Routes>
                            <Route path="/login" element={<Login />} />
                            <Route path="/signup" element={<Signup />} />
                            <Route path="/" element={<Home />} />
                            <Route path="*" element={<NotFound />} />
                        </Routes>)}

                </Container>
            </UserDispatchContext.Provider>
        </UserContext.Provider>
    )
}

export default App;