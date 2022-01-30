import React, { useContext } from "react";
//import { Button } from "./pagesStyled/button.styled";
import logo from '../assets/cya.svg';
import { signup } from '../api/auth';
import { Link, Navigate } from "react-router-dom";
import { Form, Button, Container } from "react-bootstrap";
import { Controller, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { UserContext, UserDispatchContext } from "../utils/userContext";

function Signup() {
    const navigate = useNavigate();
    const { handleSubmit, getValues, control, setError, formState: { errors } } = useForm();
    const { loginDispatcher } = useContext(UserDispatchContext);
    const user = useContext(UserContext);

    //handles the input 
    const onSubmit = data => {
        signup(data.email, data.username, data.password)
            .then(res => {
                loginDispatcher(res.data._id);
                navigate("/");
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
                    <p className="fs-5 text-muted">Ready to join?</p>
                    <Form className="form mt-3" onSubmit={handleSubmit(onSubmit)}>
                        <Form.Group className="mb-3" controlId="formusername">
                            <Form.Label>Username</Form.Label>
                            <Controller
                                control={control}
                                name="username"
                                defaultValue=""
                                rules={{
                                    required: {
                                        value: true,
                                        message: "Username required"
                                    }
                                }}
                                render={({ field: { onChange, value, ref, isInvalid } }) => (
                                    <Form.Control
                                        placeholder="Username"
                                        onChange={onChange}
                                        ref={ref}
                                        value={value}
                                        isInvalid={errors.username}
                                    />
                                )}
                            />
                            <Form.Control.Feedback type="invalid">{errors.username?.message}</Form.Control.Feedback>
                        </Form.Group>
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
                                    },
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
                        <Form.Group className="mb-3">
                            <Form.Label>Confirm Password</Form.Label>
                            <Controller
                                name="passwordConfirmation"
                                control={control}
                                defaultValue={""}
                                rules={{
                                    required: {
                                        value: true,
                                        message: "Please re-enter your password."
                                    },
                                    validate: {
                                        confirm: value => value === getValues("password"),
                                    },
                                    deps: "password"
                                }}
                                render={({ field: { onChange, value, ref, isInvalid } }) => (
                                    <Form.Control
                                        placeholder="Password"
                                        type="password"
                                        onChange={onChange}
                                        ref={ref}
                                        value={value}
                                        isInvalid={errors.passwordConfirmation}
                                    />
                                )}
                            />

                            <Form.Control.Feedback type="invalid">
                                {errors.passwordConfirmation?.type === "confirm" ? "Passwords must match" : errors.passwordConfirmation?.message}
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Control.Feedback type="invalid">
                            {errors.form}
                        </Form.Control.Feedback>
                        <Button variant="outline-primary"
                            type="submit"
                            className="ms-1 fw-bold w-100 mt-1"
                        >
                            Sign up
                        </Button >
                        <div className="text-center mt-3">Already got an account? <br></br><Link className="text-secondary" to="/login">Log in instead</Link>
                        </div>
                    </Form>
                </div>
            </div>
        </Container>
    );
}
export default Signup;