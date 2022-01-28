import React from "react";
import { Link, NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
//import { Button } from "./pagesStyled/button.styled";
import logo from './cya.svg';
import GoogleLogin from "react-google-login";
import {useRef, useState,useEffect} from 'react';
import Login from "./Login";
import { Button, Alert,Breadcrumb,Card, Form} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css'
import validator from 'validator'
import ValidationInputs from "./ValidationInputs";

function Signup () 
{
  //handles when user puts their 
  //info and assigns those info to 
  //values and stores them in variables
  //(eg. erdi@mail.com => email ) 
  const handleChange =(e)=>{
    setValues({ 
      ...values,[e.target.name]:e.target.value,
    })
  }
  //react hook to match user values with following variables:
  const[values, setValues] = useState(
    {
      username:'',
      email:'',
      password:'',
      repassword:''}
    )
  //error hook to show error message during signup
  const [err,setErr] = useState({});

  //behaviour control of the signup form
  const handleSubmission=(e)=>{
    e.preventDefault();
    let credentials = ValidationInputs(values);
    setErr(credentials);

  }
  //navigates between pages
  const navigate = useNavigate();

  //the actually sign up page(HTML)
  return (
      <div className="base-container"> 
        <div className="content"> 
        <div className="image">
          <img src={logo} alt="cya" id="cya" />
          </div>
          <div className="form">
            <div className="username">
              <label htmlFor="username">Username</label>
              <input 
              type="text" 
              name="username" 
              placeholder="username"
              value={values.username}
              onChange={handleChange}
              required
              />
              {err.username && <p style={{color:"red"}} className="error">{err.username} </p>}
              </div>
            <div className="email">
              <label htmlFor="email">Email</label>
              <input 
              type="email" 
              name="email" 
              placeholder="example@email.com"
              //ref ={userReferance}
              value={values.email}
              onChange={handleChange}
              required
              />
              {err.email && <p style={{color:"red"}} className="error">{err.email} </p>}

              </div>
            <div className="password">
              <label htmlFor="password">Password</label>
              <input 
              type="password" 
              name="password" 
              placeholder="password"  
              //ref ={userReferance}
              value={values.password}
              onChange={handleChange}
              required
              />
              {err.password && <p style={{color:"red"}} className="error">{err.password} </p>}

              </div>
            <div className="repassword">
              <label htmlFor="repassword">Confirm Password</label>
              <input 
              type="password" 
              name="repassword" 
              placeholder="Confirm password"
              //ref ={userReferance}
              value={values.repassword}
              onChange={handleChange}
              required/>
              {err.repassword && <p style={{color:"red"}} className="error">{err.repassword} </p>}
            </div> 
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
              
            }}
              onClick={handleSubmission}
              //onSubmit={handleSubmission}
              type="Signup" 
              className="submit"> 
            Sign up 
          </Button >
          </div>
            <a style={{marginTop:"10px"}} href={"#"} className = "input-login" onClick={()=> {navigate("/login")}}> 
              Got An Account? Login!  
            </a>
          </div>
        </div>
      </div>
    );
  }
  export default Signup;

  /*function testy()
  {
    return(
      <>
    <Alert variant="primary"></Alert> 
            <Breadcrumb>
              <Breadcrumb.Item>
              Breakcrump item
              </Breadcrumb.Item>
            </Breadcrumb>
            <Card className = "mb-3" style={{color:"black"}}>
              <Card.Img/>
                <Card.Body>
                  <Card.Title>
                    Card example
                  </Card.Title>
                  <Card.Text>
                    THis is the card text
                  </Card.Text>

                  <Form>
                    <Form.Group>
                      <Form.Label>
                        Email Adress
                      </Form.Label>
                      <Form.Control type = "email" placeholder="example@email.com"/>
                      <Form.Text className = "text-muted">
                          This is the muted text
                        </Form.Text>
                    </Form.Group>
                  </Form>
                  <Button variant="primary">
                    Test Button

                  </Button>
                </Card.Body>
            </Card>
            </>
    );
 
*/