import '../assets/custom.scss';
import React, { useContext, useEffect } from 'react';
import {
  Link, Navigate, useLocation, useNavigate,
} from 'react-router-dom';
import { Form, Button, Container } from 'react-bootstrap';
import { Controller, useForm } from 'react-hook-form';
import { UserContext } from '../utils/context';
import loginFacade from '../utils/loginFacade';
import { TITLE } from '../assets/constants';

/**
 * Returns Login component
 * @returns {JSX.Element} React component that allows User to login
 * @constructor
 */
function Login() {
  // use react hook form to handle form navigation
  const {
    handleSubmit,
    control,
    setError,
    formState: { errors },
  } = useForm();
  const redirect = useLocation().state?.from?.pathname || '/';
  const navigate = useNavigate();
  // get login and user from context
  const { user, setUser } = useContext(UserContext);
  useEffect(() => {
    document.title = `${TITLE} - login`;
  }, []);
  // handles the input
  const onSubmit = (data) => {
    console.log(redirect);
    loginFacade(data, setError, navigate, redirect, setUser);
  };
  // redirect to home page if already signed in
  if (user?.id) return <Navigate to="/" replace />;
  return (
    <Container className="d-flex h-100 justify-content-center">
      <div className="loginContainer align-self-center">
        <div className="content p-5 my-5 bg-white rounded">
          <h2 className="fw-bold fs-2 mb-0">Hi there!👋</h2>
          <p className="fs-5 text-muted">Let&apos;s get you signed in.</p>
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
                    message: 'Email required',
                  },
                }}
                render={({
                  field: {
                    onChange, value, ref,
                  },
                }) => (
                  <Form.Control
                    placeholder="example@email.com"
                    onChange={onChange}
                    ref={ref}
                    value={value}
                    isInvalid={errors.email}
                  />
                )}
              />
              <Form.Control.Feedback type="invalid">
                {errors.email?.message}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Controller
                name="password"
                control={control}
                defaultValue=""
                rules={{
                  required: {
                    value: true,
                    message: 'Password required',
                  },
                  minLength: {
                    value: 5,
                    message: 'Password must be at least 5 characters long.',
                  },
                }}
                render={({
                  field: {
                    onChange, value, ref,
                  },
                }) => (
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
              <Form.Control.Feedback type="invalid">
                {errors.password?.message}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Control.Feedback type="invalid">
              {errors.form?.message}
            </Form.Control.Feedback>
            <Button
              variant="outline-primary"
              type="submit"
              className="ms-1 fw-bold w-100 mt-1"
            >
              login
            </Button>
            <div className="text-center mt-3">
              Need an account?
              {' '}
              <br />
              <Link className="text-secondary" to="/signup">
                Sign up instead
              </Link>
            </div>
          </Form>
        </div>
      </div>
    </Container>
  );
}
export default Login;
