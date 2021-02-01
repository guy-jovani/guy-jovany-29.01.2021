

import React, { useState, useEffect }  from 'react';

import { connect } from 'react-redux';
import * as actionCreators from '../../store/actions/index';
import classes from './Manage.module.scss';
import { inputChangeHandler } from '../../shared/utility';
import Loading from '../../components/UI/Loading/Loading';
import Input from '../../components/UI/Input/Input';
import MsgDialog from '../../components/MsgDialog/MsgDialog';
import ConfirmationDialog from '../../components/ConfirmationDialog/ConfirmationDialog';

const Manage = props => { 

  const [errorMsg, setErrorMsg] = useState([]);
  const [confirmDialog, setConfirmDialog] = useState(false);
  const [deleteInd, setDeleteInd] = useState(-1);
  const [showMsg, setShowMsg] = useState(false);
  const [listSent, setListSent] = useState(true);
  
  const [form, setForm] = useState({
    idForm: {
      id: {
        elementType: 'input', 
        elementProps: {
          type: 'text',
          id: 'id',
          placeholder: "The User Id you want to look for.",
          value: ''
        },
        validation: {
          required: true,
          isNumeric: true
        },
        valid: false,
        errorMessages: [],
        label: 'User Id:'
      }
    },
    formValid: false
  });

  useEffect(() => {
    return props.onReset;
  }, []);

  const changeTab = e => {
    setListSent(e.target.textContent === 'Sent');
  }
  
  const submitIdHandler = e => {
    e.preventDefault();
    setShowMsg(true);
    if (!form.formValid) {
      setErrorMsg(['The Form is Invalid']);
      setTimeout(() => {
        setErrorMsg([]);
        setShowMsg(false);
      }, 2000);
      return;
    }
    const id = form.idForm.id.elementProps.value;

    props.onSubmit(id);
  };

  const deleteMail = (allow) => {
    if (allow) {
      const email = listSent ? props.sent[deleteInd] : props.received[deleteInd];
      setShowMsg(true);
      props.onDelete({...email, type: listSent ? 'sent' : 'received'});
    }
    setConfirmDialog(false);
    setDeleteInd(-1);
  }

  const confirm = (ind) => {
    setConfirmDialog(true);
    setDeleteInd(ind);
  }


  const getList = (list, action) => {
    if (list.length) {
      let mails = [(
        <li key='-100' className={classes.Sticky}>
          { action !== 'sent' ? <p>Sender</p> : <p>Receiver</p> }
          <p>Subject</p>
          <p>Date</p>
          <p>Message</p>
        </li>
      )]
      mails.push(...list.map((email, ind) => (
        <li key={ind}>
          { action === 'sent' ? <p>{email.receiver}</p> : <p>{email.sender}</p> }
          <p>{email.subject}</p>
          <p>{email.creation.split('T')[0]}</p>
          <p>{email.message}</p>
          <button type='button' onClick={e => confirm(ind)}>Delete?</button>
        </li>
      )));
      return mails;
    } else {
      return <li>No e-mails were {action} by the user.</li>
    }
  };

  const hideMsg = () => {
    setShowMsg(false);
  }
  

  return (
    <div className={classes.Manage}>
      <ConfirmationDialog msg='Are you sure?' action={deleteMail} show={confirmDialog}/>
      <form className={classes.Contact_Info} onSubmit={submitIdHandler} noValidate>
        <h4>ID finder</h4>
        {
          Object.entries(form.idForm).map((ele, i) => {
            return <Input 
              key={i} 
              {...ele[1]} 
              changed={(event) => 
                inputChangeHandler(event, ele[1].elementProps.id, form.idForm, setForm, 'idForm')} />
          })
        }
        <button disabled={!form.formValid} className={classes.Form_Button}>Get</button>
      </form>
      { props.loading ? <Loading /> : (
        <div className={classes.Mails}>
        <div className={classes.Tabs}>
          <h4 className={listSent ? classes.Active : ''} 
              onClick={changeTab}>
                Sent
          </h4>
          <h4 className={!listSent ? classes.Active : ''} 
              onClick={changeTab}>
                Received
          </h4>
        </div>
        <ul>
          { listSent ? getList(props.sent, 'sent') :
                      getList(props.received, 'received') }
        </ul>
      </div>
      ) }
      
      <MsgDialog msg={errorMsg.length ? errorMsg : props.errorMessages}
                  show={showMsg} hideMsg={hideMsg}/>
    </div>
  );
};

const mapStateToProps = state => {
  return {
    loading: state.manageReducer.loading,
    errorMessages: state.manageReducer.errors,
    sent: state.manageReducer.sent,
    received: state.manageReducer.received,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onSubmit: payload => dispatch(actionCreators.getMessagesAttempt(payload)),
    onReset: () => dispatch(actionCreators.resetManage()),
    onDelete: payload => dispatch(actionCreators.deleteManage(payload))
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(Manage);