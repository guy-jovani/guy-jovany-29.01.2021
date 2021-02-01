

export const updateObject = (oldObject, updatedProperties) => {
  return {
    ...oldObject,
    ...updatedProperties
  };
};

export const checkValidity = (value, rules) => {
  let errorMessages = [];
  const numPat = /^\d+$/;

  if (rules.required && value.trim() === '') {
    errorMessages.push('This field is required.');
  }

  if (rules.isNumeric && !numPat.test(value)) {
    errorMessages.push('This field should contain only numeric characters (can only be a positive number).');
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


