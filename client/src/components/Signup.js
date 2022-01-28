import React from "react";
import { Link, NavLink } from "react-router-dom";
//import { Button } from "./pagesStyled/button.styled";
import logo from './cya.svg';
import GoogleLogin from "react-google-login";
import {useRef, useState,useEffect} from 'react';
import Login from "./Login";
import { Button, Alert,Breadcrumb,Card, Form} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css'
import auth, { signup } from '../api/auth';
import axios from 'axios';

function Signup () 
{
  //react hook to match user values with following variables:
  const[username, setUsername] = useState('');
  const[email, setEmail] = useState('');
  const[password, setPassword] = useState('');
  const[repassword, setRepassword] = useState('');
  const[err,setErr] = useState(null);
 
  //handles the input 
  const handleSubmission = () =>{
   setErr(null);
   signup(email,username,password);
  }
  //the actually sign up page(HTML)
  return (
      <div className="base-container"> 
        <div className="content"> 
        <div className="image">
          <img src={logo} alt="cya" id="cya" />
          </div>
          <form className="form" onSubmit={handleSubmission}>
            <div className="username">
              <label htmlFor="username">Username</label>
              <input 
              type="text" 
              name="username" 
              placeholder="username"
              value={username}
              onChange={event=>setUsername(event.target.value)}
              required
              />
              </div>
            <div className="email">
              <label htmlFor="email">Email</label>
              <input 
              type="email" 
              name="email" 
              placeholder="example@email.com"
              value={email}
              onChange={event=>setEmail(event.target.value)}
              required
              />
              </div>
            <div className="password">
              <label htmlFor="password">Password</label>
              <input 
              type="password" 
              name="password" 
              placeholder="password"  
              value={password}
              onChange={event=>setPassword(event.target.value)}
              required
              />

              </div>
            <div className="repassword">
              <label htmlFor="repassword">Confirm Password</label>
              <input 
              type="password" 
              name="repassword" 
              placeholder="Confirm password"
              value={repassword}
              onChange={event=>setRepassword(event.target.value)}
              required/>
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
              color:'black'
              
            }}
              onClick={handleSubmission}
              type="Signup" 
              className="btn"> 
            Sign up 
          </Button >
          </div>
          <il>
          Got An Account? 
            <a style={{marginTop:"10px",color:'green'}} className = "input-login"> 
               <NavLink to = "/Login">Log In </NavLink> 
            </a>
          </il>
          </form>
        </div>
      </div>
    );
  }
  export default Signup;