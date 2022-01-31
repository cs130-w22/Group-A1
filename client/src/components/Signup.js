import '../assets/custom.scss';
import React, { useContext } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { Form, Button, Container } from 'react-bootstrap';
import { Controller, useForm } from 'react-hook-form';
import { signup } from '../api/auth';
import { UserContext } from '../utils/userContext';

function Signup() {
  const navigate = useNavigate();
  const {
    handleSubmit, getValues, control, setError, formState: { errors },
  } = useForm();
  const { user, setUser } = useContext(UserContext);

  // handles the input
  const onSubmit = (data) => {
    signup(data.email, data.username, data.password)
      .then((res) => {
        // on success, save user and navigate to home page
        setUser(res.data.userId);
        navigate('/');
      })
      .catch((err) => {
        // add server-side errors to validation displays
        const errData = err.response?.data;
        if (errData == null) {
          return;
        }
        const apiErrors = errData.errors;
        if (apiErrors?.length > 0) {
          for (let i = 0; i < apiErrors.length; i += 1) {
            const errorType = apiErrors[i].param;
            const errorMsg = apiErrors[i].msg;
            setError(
              errorType,
              { type: 'api', message: errorMsg },
              { shouldFocus: true },
            );
          }
        } else if (err.response.status === 500) {
          errors.form = "We're sorry! Something went wrong on our end.";
        }
      });
  };
  // redirect to home page if already signed in
  if (user?.id) return <Navigate to="/" replace />;
  return (
    <Container className="d-flex h-100 justify-content-center">
      <div className="loginContainer align-self-center">
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
                    message: 'Username required',
                  },
                }}
                render={({
                  field: {
                    onChange, value, ref,
                  },
                }) => (
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
              <Form.Control.Feedback type="invalid">{errors.email?.message}</Form.Control.Feedback>
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
              <Form.Control.Feedback type="invalid">{errors.password?.message}</Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Confirm Password</Form.Label>
              <Controller
                name="passwordConfirmation"
                control={control}
                defaultValue=""
                rules={{
                  required: {
                    value: true,
                    message: 'Please re-enter your password.',
                  },
                  validate: {
                    confirm: (value) => value === getValues('password'),
                  },
                  deps: 'password',
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
                    isInvalid={errors.passwordConfirmation}
                  />
                )}
              />

              <Form.Control.Feedback type="invalid">
                {errors.passwordConfirmation?.type === 'confirm' ? 'Passwords must match' : errors.passwordConfirmation?.message}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Control.Feedback type="invalid">
              {errors.form}
            </Form.Control.Feedback>
            <Button
              variant="outline-primary"
              type="submit"
              className="ms-1 fw-bold w-100 mt-1"
            >
              Sign up
            </Button>
            <div className="text-center mt-3">
              Already got an account?
              {' '}
              <br />
              <Link className="text-secondary" to="/login">Log in instead</Link>
            </div>
          </Form>
        </div>
      </div>
    </Container>
  );
}
export default Signup;
