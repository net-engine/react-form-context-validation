# React Form Validation

React Form Validation is a minimalist package providing form validation to React components using the React Context API with full typescript support.

## Installation

> npm install react-form-context-validation --save

## Requirements

> React 16.8+

## Usage

```JSX
import React, { useState, ChangeEvent } from 'react';
import FormValidation, { withFormValidation, useFormValidation, useFormValidator, FormValidationConsumer } from "react-form-context-validation";

function MyForm (): JSX.Element {
  const [value, setValue] = useState('');

  // useFormValidation hook can access form validation state from within the form tree
  const { valid, formErrors } = useFormValidation();

  // Errors can be passed to useFormValidator to be added to formErrors from anywhere in the form tree
  // if passed error is falsy, all reference to it will be removed from formErrors.
  //
  // A unique ID can be passed as the second parameter for reference, if no ID is passed one will be set dynamically
  useFormValidator(value.length < 10 && 'Value must be at least 10 characters long', 'valueLength');

  return (
    <div>
      <RequiredField
        value={value}
        onChange={setValue}
        name="testField"
      />

      {/* formErrors can be indexed by ID to check for specific errors */}
      {formErrors['valueLength'] && (
        <span>
          Value is not long enough!
        </span>
      )}
      {formErrors['testField'] && (
        <span>
          Test field has an error!
        </span>
      )}

      {/* formErrors can be mapped over to get a list of all errors */}
      <ul>
        {Object.keys(formErrors).map((errorKey, i) => (
          <li key={i}>
            <b>{errorKey}</b>: {formErrors[errorKey]}
          </li>
        ))}
      </ul>

      {/* "valid" field provided to easily check there are no errors on the form */}
      <button disabled={!valid}>
        Submit
      </button>

    </div>
  )
}

interface FieldProps {
  value: string;
  onChange: (val: string) => void;
  name?: string;
}

function RequiredField ({ value, onChange, name }: FieldProps): JSX.Element {
  // Error can be a string to display to the user, or a boolean for convenience otherwise
  const errorString = useFormValidator(!value && 'Required!', name);
  const error = useFormValidator(!value);

  return (
    <div>
      <input
        value={value}
        onChange={(evt) => onChange(evt.currentTarget.value)}
        className={error ? 'has-error' : ''}
      />
      {errorString && (
        <span>
          {errorString}
        </span>
      )}
    </div>
  )
}

// Use withFormValidation HOC to wrap component with FormValidation context provider when exported
export default withFormValidation(MyForm)

// Form validation context provider and consumer can be access directly via FormValidation and FormValidationConsumer
function MyApp () {
  return (
    <FormValidation>
      <MyForm />

      <FormValidationConsumer>
        {({ valid }) => (
          <span>
            My form {valid ? 'is' : `isn\'t`} valid!
          </span>
        )}
      </FormValidationConsumer>
    </FormValidation>
  )
}
```

## License
[MIT](https://choosealicense.com/licenses/mit/)
