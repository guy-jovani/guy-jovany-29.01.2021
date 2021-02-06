

export const updateObject = (oldObject, updatedProperties) => {
  return {
    ...oldObject,
    ...updatedProperties
  };
};

export const checkValidity = (value, rules) => {
  let errorMessages = [];
  const emailPat = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;

  if (rules.required && value.trim() === '') {
    errorMessages.push('This field is required.');
  }

  if (rules.isEmail && !emailPat.test(value)) {      
    errorMessages.push('Please provide a valid Email address.');
  }
  
  if (rules.minLength && value.trim().length < rules.minLength) {
    errorMessages.push(`This field should be at least ${rules.minLength} characters long.`);
  }

  return errorMessages;
};


export const inputChangeHandler = (event, id, form, setForm, innerFormName) => {
  const messages = checkValidity(event.target.value,
                                 form[id].validation);
  const updatedInput = {
    ...form[id], 
    errorMessages: messages,
    valid: !messages.length
  };
  updatedInput.elementProps = {...form[id].elementProps, value: event.target.value};

  const updatedForm = {
    ...form, 
    [id]: updatedInput
  }

  let formIsValid = true;
  for (let inputIdentifier in updatedForm) {
    formIsValid = updatedForm[inputIdentifier].valid && formIsValid;
  }
  
  setForm({
    [innerFormName]: updatedForm,
    formValid: formIsValid
  })
};


