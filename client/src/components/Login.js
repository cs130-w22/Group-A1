import "./custom.scss";
import React, { useContext } from "react";
import logo from '../assets/cya.svg';
import { useRef, useState, useEffect } from 'react';
//import { GoogleLogin, GoogleLogout } from 'react-google-login';
import { login } from '../api/auth';
import { Link, Navigate } from "react-router-dom";
import { Form, Button, Container } from "react-bootstrap";
import { Controller, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { UserContext, UserDispatchContext } from "../utils/userContext";

function Login() {
    const navigate = useNavigate();
    const { handleSubmit, control, setError, formState: { errors } } = useForm();
    const { loginDispatcher } = useContext(UserDispatchContext);
    const user = useContext(UserContext);
    //handles the input
    const onSubmit = data => {
        login(data.email, data.password)
            .then(res => {
                console.log("Logging in")
                loginDispatcher(res.data._id).then((res) => {
                    navigate("/")
                });
            })
            .catch(err => {
                const errData = err.response?.data;
                if (errData == null) {
                    console.log(err);
                    return
                }
                if (errData.errors && errData.errors.length > 0) {
                    for (const error of errData.errors) {
                        const errorType = error.param;
                        const errorMsg = error.msg;
                        setError(errorType, { type: "api", message: errorMsg }, { shouldFocus: true });
                    }
                } else if (err.response.status === 401) {
                    if (errData !== 'Unauthorized') setError("email", { type: "api", message: "No user exists for this email" }, { shouldFocus: true },);
                    else setError("password", { type: "api", message: "Incorrect email/password" }, { shouldFocus: true });
                } else if (err.response.status === 500) {
                    errors.form = "We're sorry! Something went wrong on our end."
                }
            });
    }
    // redirect to home page if signed in
    if (user?.id) return <Navigate to="/" replace />
    return (
        <Container className="d-flex h-100 justify-content-center">
            <div className="loginContainer align-self-center">
                {/* <LoginHeader /> */}
                <div className="content p-5 my-5 bg-white rounded">
                    <h2 className="fw-bold fs-2 mb-0">Hi there!👋</h2>
                    <p className="fs-5 text-muted">Let's get you signed in.</p>
                    <Form className="form mt-3" onSubmit={handleSubmit(onSubmit)}>
                        <Form.Group className="mb-3" controlId="formEmail">
                            <Form.Label>Email</Form.Label>
                            <Controller
                                control={control}
                                name="email"
                                defaultValue=""
                                rules={{
                                    required: {
                                        value: true,
                                        message: "Email required"
                                    }
                                }}
                                render={({ field: { onChange, value, ref, isInvalid } }) => (
                                    <Form.Control
                                        placeholder="example@email.com"
                                        onChange={onChange}
                                        ref={ref}
                                        value={value}
                                        isInvalid={errors.email}
                                    />
                                )}
                            />
                            <Form.Control.Feedback type="invalid">{errors.email?.message}</Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Password</Form.Label>
                            <Controller
                                name="password"
                                control={control}
                                defaultValue={""}
                                rules={{
                                    required: {
                                        value: true,
                                        message: "Password required"
                                    },
                                    minLength: {
                                        value: 5,
                                        message: "Password must be at least 5 characters long."
                                    }
                                }}
                                render={({ field: { onChange, value, ref, isInvalid } }) => (
                                    <Form.Control
                                        placeholder="Password"
                                        type="password"
                                        onChange={onChange}
                                        ref={ref}
                                        value={value}
                                        isInvalid={errors.password}
                                    />
                                )}
                            />
                            <Form.Control.Feedback type="invalid">{errors.password?.message}</Form.Control.Feedback>
                        </Form.Group>
                        <Form.Control.Feedback type="invalid">
                            {errors.form}
                        </Form.Control.Feedback>
                        <Button variant="outline-primary"
                            type="submit"
                            className="ms-1 fw-bold w-100 mt-1"
                        >
                            Sign in
                        </Button >
                        <div className="text-center mt-3">Need an account? <br></br><Link className="text-secondary" to="/signup">Sign up instead</Link>
                        </div>
                    </Form>
                </div>
            </div>
        </Container>
    );
};
export default Login;