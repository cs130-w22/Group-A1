import { login } from '../api/auth';

class ErrorHandler {
  constructor(errResponse, errorStatus, errType, errFocus) {
    this.errResponse = errResponse;
    this.errorStatus = errorStatus;
    this.errType = errType || 'api';
    if (errFocus != null) this.errorFocus = { shouldFocus: errFocus };
    else this.errorFocus = { shouldFocus: true };
  }

  setErrors(setError) {
    if (this.errResponse == null
      || this.errResponse.data == null
      || this.errorStatus == null) return;
    const validationErrors = this.errResponse.data?.errors;
    if (validationErrors?.length > 0) {
      for (let i = 0; i < validationErrors.length; i += 1) {
        const errorParam = validationErrors[i].param;
        const errorMsg = validationErrors[i].msg;
        setError(
          errorParam,
          { type: this.errType, message: errorMsg },
          this.errFocus,
        );
      }
    } else if (this.errorStatus === 401) {
      if (this.errResponse.data) {
        setError(
          this.errResponse.data.field,
          { type: this.errType, message: this.errResponse.data.msg },
          this.errFocus,
        );
      }
    } else if (this.errorStatus === 500) {
      setError(
        'form',
        { type: this.errType, message: "We're sorry! Something went wrong on our end." },
        this.errFocus,
      );
    }
  }
}
const loginFacade = (email, password, setError, navigate, setUser) => {
  login(email, password)
    .then((res) => {
      // on success, save user and navigate to home page
      setUser({ userId: res.data.userId, username: res.data.username });
      navigate('/');
    })
    .catch((err) => {
      // add server-side errors to validation displays
      const errorHandler = new ErrorHandler(err.response, err.response.status);
      errorHandler.setErrors(setError);
    });
};

export default loginFacade;
