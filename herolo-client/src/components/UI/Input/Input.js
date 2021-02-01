

import React from 'react';

import classes from './Input.module.scss';

const Input = props => { 
  let inputElement = null;

  let inputClass = '', errorP = null;

  if (props.errorMessages.length) {
    inputClass = classes.Invalid;
    errorP = (
      <p className={classes.Error_Container}>
        {props.errorMessages.map((err, i) => {
          return (
            <span key={i} className={classes.Error}>
              {err}
            </span>
          )
        })}
      </p>
    )
  }
  
  switch(props.elementType) {
    case 'textarea':
      inputElement = <textarea
                        {...props.elementProps} 
                        onChange={props.changed} 
                        className={inputClass}>
                      </textarea>
      break;
    default:
        inputElement = <input {...props.elementProps} onChange={props.changed} className={inputClass}/>
  }

  return (
    <div className={classes.Form_Row}>
      <div>
        <label htmlFor={props.id}>
          {props.label}
          { props.validation.required ? <abbr _ngcontent-fmq-c44="" title="required" aria-label="required">*</abbr> : null }
        </label>
        {inputElement}
      </div>
      {errorP}
    </div>
  );
};

export default Input;

