

import React, { useState, useEffect } from 'react';

import { connect } from 'react-redux';
import * as actionCreators from '../../store/actions/index';
import classes from './Compose.module.scss';

import { inputChangeHandler } from '../../shared/utility';
import Loading from '../../components/UI/Loading/Loading';
import Input from '../../components/UI/Input/Input';
import MsgDialog from '../../components/MsgDialog/MsgDialog';

const Compose = props => {
  const [errorMsg, setErrorMsg] = useState([]);
  const [showMsg, setShowMsg] = useState(false);
  const [success, setSuccess] = useState(false);

  const [form, setForm] = useState({
    emailForm: {
      sender: {
        elementType: 'input', 
        elementProps: {
          type: 'text',
          id: 'sender',
          placeholder: "Your Id.",
          value: ''
        },
        validation: {
          required: true,
          isNumeric: true
        },
        valid: false,
        errorMessages: [],
        label: 'Sender Id:'
      },
      subject: {
        elementType: 'input', 
        elementProps: {
          type: 'text',
          id: 'subject',
          placeholder: "Enter your subject",
          value: ''
        },
        validation: {
          required: true,
          minLength: 3
        },
        valid: false,
        errorMessages: [],
        label: 'Subject:'
      },
      receiver: {
        elementType: 'input', 
        elementProps: {
          type: 'text',
          id: 'receiver',
          placeholder: "Your receiver Id.",
          value: ''
        },
        validation: {
          required: true,
          isNumeric: true
        },
        valid: false,
        errorMessages: [],
        label: 'Receiver Id:'
      },
      content: {
        elementType: 'textarea', 
        elementProps: {
          id: 'content',
          placeholder: "Your message goes here...",
          value: ''
        },
        validation: {
          required: true
        },
        valid: false,
        errorMessages: [],
        label: 'Message:'
      }
    },
    formValid: false
  });

  useEffect(() => {
    return props.onReset;
  }, []);

  useEffect(() => {
    if (props.operationType === 'success') {
      setForm({
        formValid: false,
        emailForm: {
          sender: {
            ...form.emailForm.sender,
            elementProps: {
              ...form.emailForm.sender.elementProps,
              value: ''
            },
            valid: false,
            errorMessages: [],
          },
          subject: {
            ...form.emailForm.subject,
            elementProps: {
              ...form.emailForm.subject.elementProps,
              value: ''
            },
            valid: false,
            errorMessages: [],
          },
          receiver: {
            ...form.emailForm.receiver,
            elementProps: {
              ...form.emailForm.receiver.elementProps,
              value: ''
            },
            valid: false,
            errorMessages: [],
          },
          content: {
            ...form.emailForm.content,
            elementProps: {
              ...form.emailForm.content.elementProps,
              value: ''
            },
            valid: false,
            errorMessages: [],
          }
        }
      })
      setSuccess(true);
    }
  }, [props.operationType]);

  const submitEmailHandler = e => {
    e.preventDefault();
    setShowMsg(true);
    setSuccess(false);
    if (!form.formValid) {
      setErrorMsg(['The Form is Invalid']);
      setTimeout(() => {
        setErrorMsg([]);
        setShowMsg(false);
      }, 2000);
      return;
    }
    const sender = form.emailForm.sender.elementProps.value;
    const receiver = form.emailForm.receiver.elementProps.value;
    const subject = form.emailForm.subject.elementProps.value;
    const content = form.emailForm.content.elementProps.value;
    
    props.onSubmit({sender, receiver, subject, content});
  };

  const hideMsg = () => {
    setShowMsg(false);
  }

  return (
    <div className={classes.Compose}>
      { props.loading ? <Loading /> : null }
      { success ? <p>Email sent successfully!</p> : null}
      <form className={classes.Contact_Info} onSubmit={submitEmailHandler} noValidate>
        <h4>Email Info</h4>
        {
          Object.entries(form.emailForm).map((ele, i) => {
            return <Input 
              key={i} 
              {...ele[1]} 
              changed={(event) => 
                inputChangeHandler(event, ele[1].elementProps.id, form.emailForm, setForm, 'emailForm')} />
          })
        }
        <button disabled={!form.formValid}>Send</button>
      </form>
      <MsgDialog msg={errorMsg.length ? errorMsg : props.errorMessages}
                  show={showMsg} hideMsg={hideMsg} />
    </div>
  );
};

const mapStateToProps = state => {
  return {
    loading: state.composeReducer.loading,
    errorMessages: state.composeReducer.errors,
    operationType: state.composeReducer.operationType
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onSubmit: payload => dispatch(actionCreators.postMsgAttempt(payload)),
    onReset: () => dispatch(actionCreators.resetCompose()),
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(Compose);