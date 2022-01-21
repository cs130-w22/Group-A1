import React, { useState } from 'react';
import { Route, Routes } from "react-router-dom";
import Home from './components/Home';
import NotFound from './components/NotFound';
import { Container } from 'react-bootstrap'
import styled from 'styled-components';
import { Navigation } from './Navigation';
import Login from './components/Login';


function App() {
  return (
    <div>
      <Navigation/>
      <Container className="mt-3">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Home />} />
          <Route path="*" element={<NotFound />} /> 
        </Routes>
      </Container>
    </div>
  )
}

export default App;