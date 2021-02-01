

import React from 'react';

import classes from './MsgDialog.module.scss';

const MsgDialog = props => { 
  const classesNames = props.msg.length && props.show ?
                [classes.MsgDialog, classes.MsgDialogShow] : 
                [classes.MsgDialog, classes.MsgDialogHide];


  return (
    <div className={classesNames.join(' ')} onClick={props.hideMsg}>
      <ul>
        {
          props.msg ? props.msg.map((msg, i) => (<li key={i}>{msg}</li>)) :
          null
        }
      </ul>
    </div>
  );
};

export default MsgDialog;