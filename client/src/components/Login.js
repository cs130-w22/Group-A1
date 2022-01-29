import React from "react";
import "./colors.scss";
import logo from './cya.svg';
import { Box } from "./pagesStyled/button.styled";
import { BrowserRouter as Router, Route, Routes, useNavigate,Link,NavLink } from "react-router-dom";
import {useRef, useState,useEffect} from 'react';
//import { GoogleLogin, GoogleLogout } from 'react-google-login';
import GLogin from "./google.button";
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css'
import axios from 'axios';
import auth, { login } from '../api/auth';


function Login ()
 {
  const[email, setEmail] = useState("");
  const[password, setPassword] =useState("");
  const[err, setErr] = useState(null);
  //handles the input
  const handleSubmission = () =>{
    setErr(null);
    login(email,password);
  }
    return (
      
      <div className="base-container">
        <div className="header"></div>
        <div className="content">
          <div className="image">
          <img src={logo} alt="cya" id="cya" />
          </div>
          
          <form className="form" onSubmit={handleSubmission}>
            <div className="form-group">
              <label 
              htmlFor="email">Email</label>
              <input 
                type="email" 
                name="email"
                onChange={(e)=>setEmail(e.target.value)}
                value={email}
                placeholder="example@email.com" 
                required
                />
              <label htmlFor="password">Password</label>
              <input type="password" 
                name="password" 
                placeholder="password"
                onChange={(e)=>setPassword(e.target.value)}
                value={password}
                required
               />
            </div>
            {err && <div className="err">{err}</div>}
            <div>
            <Button
              style={{
                textAlign:'center',
                justifyContent: 'center',
                alignItems: 'center',
                paddingLeft:40,
                marginTop:10,
                paddingRight:40,
                marginBottom:10,
                height:40,
                backgroundColor:"transparent",
                color:"black"
              }}
              onSubmit={handleSubmission}
              type="Login" 
              className="btn"> 
              Login  
          </Button >

            </div>
            
            <p style={{
            textAlign:"center",
            marginBottom:10,
            justifyContent: 'center',
            alignItems: 'center',}}  
            className="seperation"> or </p>
          <Box size="10px" >
            <GLogin/>
          </Box>
            <il>
          Got An Account? 
              <a style={{marginTop:"10px"}} className = "input-login"> 
                <NavLink to = "/Signup"> Sign Up </NavLink> 
              </a>
            </il>
          </form>
        </div> 
      </div>
    );
  };
export default Login;