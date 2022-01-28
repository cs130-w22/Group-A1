import React from "react";
import "./colors.scss";
import logo from './cya.svg';
import Home from "./Home"
import styled from 'styled-components'
import { Box } from "./pagesStyled/button.styled";
import { BrowserRouter as Router, Route, Routes, useNavigate,Link,NavLink } from "react-router-dom";
import {useRef, useState,useEffect} from 'react';
import { GoogleLogin, GoogleLogout } from 'react-google-login';
import GLogin from "./google.button";
import GoogleButton from 'react-google-button';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css'
import { backgroundColor } from "styled-system";



function Login ()
 {
  const userReferance = useRef();
  const errorReference = useRef();
  const[name, setName] = useState("");
  const[password, setPassword] =useState("");
  const[error, setError] = useState("");
  const[yay,setYay] = useState(false);

  const handleSubmission = async(event)=>{
    event.preventDefault();
    setName("");
    setPassword("");
    console.log(name,password);
    setYay(true);
  }

  useEffect(()=>{
    userReferance.current.focus();
  },[]);

  useEffect(()=>{
    setError('');
  },[name,password])

    return (
      <>
      {yay ? (
      <section>
        <h1>
          <Home/>
        </h1>
        <br/>
        <div navigate to ="/Login">  
          <span href="#" > 
            Logout
          </span>
          </div>
      </section>):(
      
      <div className="base-container">
        <p
          ref={errorReference} className={error ? "errmessage":"offscreen"} 
          aria-live="assertive">{error}
        </p>
        <div className="header"></div>
        
        <div className="content">
          <div className="image">
          <img src={logo} alt="cya" id="cya" />
          </div>
          
          <form className="form" onSubmit={handleSubmission}>
            <div className="form-group">
              <label 
              htmlFor="email">Email</label>
              <input type="text" 
                name="email" 
                ref ={userReferance}
                onChange={(e)=>setName(e.target.value)}
                value={name}
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
                //border:"30px",
                color:"black"
              }}
              onSubmit={handleSubmission}
              type="Login" 
              className="btn"> 
            Login 
            
          </Button >
            <p style={{
            textAlign:"center",
            marginBottom:10,
            justifyContent: 'center',
            alignItems: 'center',}}  
            className="seperation"> or </p>
            <Box size="10px" >
              <GLogin/>
            </Box>
            <NavLink to = "/Signup">  
              <span href="#" className = "input-login"> 
                Not one of us? Signup!
              </span>
            </NavLink>
          </form>
        </div> 
        
      </div>
      
      )}</>
    );
  };
export default Login;