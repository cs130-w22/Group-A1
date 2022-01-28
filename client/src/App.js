import React, { useState } from 'react';
import { Route, Routes } from "react-router-dom";
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
          <Route path="/Login" exact element={<Login />} />
          <Route path="/" exact element={<Home />} />
          <Route path="*" exact element={<NotFound />} /> 
          <Route path="/Signup" exact element={<Signup />} />
        </Routes>
      </Container>
    </div>
  )
}

export default App;