import React from "react";
import { Link, NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Button } from "./pagesStyled/button.styled";
import logo from './cya.svg';
import GoogleLogin from "react-google-login";
import {useRef, useState,useEffect} from 'react';
import Login from "./Login";

function Signup () 
{
  const userReferance = useRef();
  const errorReference = useRef();
  const[username, setUsername] = useState("");
  const[email, setEmail] = useState("");
  const[password, setPassword] =useState("");
  const[repassword, setRepassword] =useState("");
  const[error, setError] = useState("");
  const[yay,setYay] = useState(false);

  const handleSubmission = async(event)=>{
    event.preventDefault();
    setUsername("");
    setEmail("");
    setPassword("");
    setRepassword("");
    console.log(username,email,password,repassword);
    setYay(true);
  }

  useEffect(()=>{
    userReferance.current.focus();
  },[]);

  useEffect(()=>{
    setError('');
  },[username,email,password,repassword])

  const navigate = useNavigate();
  return (
    <>
    {yay ? (
    <section>
      <h1>
        <Login/>
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
        <div className="content"> 
        <div className="image">
          <img src={logo} alt="cya" id="cya" />
          </div>
          <div className="form">
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input 
              type="text" 
              name="username" 
              placeholder="username"
              ref ={userReferance}
              onChange={(e)=>setUsername(e.target.value)}
              value={username}
              required
              />
              </div>
              <div className="form-group">
              <label htmlFor="email">Email</label>
              <input 
              type="email" 
              name="email" 
              placeholder="email"
              ref ={userReferance}
              onChange={(e)=>setEmail(e.target.value)}
              value={email}
              required
              />
              </div>
              <div className="form-group">
              <label htmlFor="password">Password</label>
              <input 
              type="password" 
              name="password" 
              placeholder="password"  
              ref ={userReferance}
              onChange={(e)=>setPassword(e.target.value)}
              value={password}
              required
              />
            </div>
            <div className="form-group">
              <label htmlFor="repassword">Confirm Password</label>
              <input 
              type="password" 
              name="repassword" 
              placeholder="Confirm password"
              ref ={userReferance}
              onChange={(e)=>setRepassword(e.target.value)}
              value={repassword} 
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
                height:40
              }}
              onSubmit={handleSubmission}
              type="Signup" 
              className="btn"> 
            Signup 
          </Button >
            
          <a style={{marginTop:"10px"}} href={"#"} className = "input-login" onClick={()=> {navigate("/login")}}> 
            Got An Account? Login!  
          </a>
          </div>
        </div>
      </div>
      )}</>
    );
  }
  export default Signup;
