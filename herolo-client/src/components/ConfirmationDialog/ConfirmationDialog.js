

import React from 'react';

import classes from './ConfirmationDialog.module.scss';

const MsgDialog = props => { 

  const classesNames = props.show ?
                        [classes.Confirm, classes.ConfirmDialogShow] : 
                        [classes.Confirm, classes.ConfirmDialogHide];

  const backdropNames = props.show ?
                        [classes.Backdrop, classes.ConfirmDialogShow] : 
                        [classes.Backdrop, classes.ConfirmDialogHide];

  return (
    <React.Fragment>
      <div className={backdropNames.join(' ')}>
        <div className={classesNames.join(' ')}>
          <p>{props.msg}</p>
          <div>
            <button type='button' onClick={() => props.action(true)}>Allow</button>
            <button type='button' onClick={() => props.action(false)}>Cancel</button>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default MsgDialog;