

import React, { useState, useEffect } from 'react';

import { connect } from 'react-redux';
import * as actionCreators from '../../store/actions/index';
import classes from './Auth.module.scss';
import { inputChangeHandler } from '../../shared/utility';
import Input from '../../components/UI/Input/Input';
import Loading from '../../components/UI/Loading/Loading';

import MsgDialog from '../../components/MsgDialog/MsgDialog';

const Auth = props => { 
  const [login, setLogin] = useState(false);
  const [errorMsg, setErrorMsg] = useState([]);
  const [showMsg, setShowMsg] = useState(false);

  const [form, setForm] = useState({
    authForm: {
      email: {
        elementType: 'input', 
        elementProps: {
          type: 'email',
          id: 'email',
          placeholder: "Ex: abcd@gmail.com",
          value: ''
        },
        validation: {
          required: true,
          isEmail: true
        },
        valid: false,
        errorMessages: [],
        label: 'Email:'
      },
      password: {
        elementType: 'input', 
        elementProps: {
          type: 'password',
          id: 'password',
          placeholder: "Enter a password",
          value: ''
        },
        validation: {
          required: true,
          minLength: 3
        },
        valid: false,
        errorMessages: [],
        label: 'Password:'
      },
      confirmPassword: {
        elementType: 'input', 
        elementProps: {
          type: 'password',
          id: 'confirmPassword',
          placeholder: "Confirm your password",
          value: ''
        },
        validation: {
          required: true,
          minLength: 3,
          equalToField: 'password'
        },
        valid: false,
        errorMessages: [],
        label: 'Confirm Password:'
      }
    },
    formValid: false
  });

  useEffect(() => {
    if (props.user) {
      props.history.push({pathname: '/'});
    }
  }, [props.user]);

  const submitSignupHandler = e => {
    e.preventDefault();
    
    setShowMsg(true);
    // if (!form.formValid) {
    //   setErrorMsg(['The Form is Invalid']);
    //   setTimeout(() => {
    //     setErrorMsg([]);
    //     setShowMsg(false);
    //   }, 2000);
    //   return;
    // }

    const email = form.authForm.email.elementProps.value;
    const password = form.authForm.password.elementProps.value;
    const confirmPassword = form.authForm.confirmPassword.elementProps.value;
    if (login) {
      props.onLogin({email, password});
    } else {
      props.onSignup({email, password, confirmPassword});
    }
  };

  const switchAuth = () => {
    setForm({
      ...form,
      authForm: {
        ...form.authForm,
        confirmPassword: {
          ...form.authForm.confirmPassword,
          elementProps: {
            ...form.authForm.confirmPassword.elementProps,
            value: ''
          },
          valid: false
        }
      },
      formValid: form.formValid && !login
    });
    hideMsg();
    setLogin(!login);
  }

  const hideMsg = () => {
    setShowMsg(false);
  }

  return (
    <div className={classes.Auth}>
      { props.loading ? <Loading /> : null }
      <form className={classes.Contact_Info} onSubmit={submitSignupHandler} noValidate>
        <h4>{login ? 'Login' : 'Signup'} Info</h4>
        {
          Object.entries(form.authForm).map((ele, i) => {
            return login && ele[0] === 'confirmPassword' ? null : <Input 
              key={i} 
              {...ele[1]} 
              changed={(event) => inputChangeHandler(event, ele[1].elementProps.id, form.authForm, setForm, 'authForm')} />
          })
        }

        <button disabled={false} className={classes.Form_Button}>
          {login ? 'Login' : 'Signup'}
        </button>
        <button type='button' 
                className={classes.Form_Button} 
                onClick={switchAuth}>Switch to {login ? 'Signup' : 'Login'}</button>
      </form>
      <MsgDialog msg={errorMsg.length ? errorMsg : props.errorMessages} show={showMsg} hideMsg={hideMsg}/>
    </div>
  );
};

const mapStateToProps = state => {
  return {
    loading: state.authReducer.loading,
    user: state.authReducer.user,
    errorMessages: state.authReducer.errors,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onSignup: (payload) => dispatch(actionCreators.signupAttempt(payload)),
    onLogin: (payload) => dispatch(actionCreators.loginAttempt(payload))
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(Auth);