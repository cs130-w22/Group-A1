import React, { useState } from 'react';
import { Route, Routes,BrowserRouter } from "react-router-dom";
import Home from './components/Home';
import NotFound from './components/NotFound';
import { Container } from 'react-bootstrap'
import styled from 'styled-components';
import { Navigation } from './Navigation';
import Login from './components/Login';
import Signup from './components/Signup';
import { Redirect } from 'react-router-dom';


function App() {
  return (
    <div>
      
      <Container className="mt-3">
        <Routes>
          <Route exact path="/Login"  element={<Login />} />
          <Route path="/" element={<Home />} />
          <Route path="*" element={<NotFound />} /> 
          <Route path="/Signup" element={<Signup />} />
        </Routes>
      </Container>
    </div>
  )
}

export default App;