import React, { useContext, useMemo, useEffect, ReactNode, useRef, useReducer } from 'react';

type FormErrors = Record<string, string | boolean>;

interface FormValidator {
  id: string;
  error: string | boolean;
}

interface FormValidationType {
  formErrors: FormErrors;
  setValidator: (validator: FormValidator) => void;
  valid: boolean;
};

interface Props {
  children: JSX.Element | JSX.Element[];
}

const Context = React.createContext<FormValidationType>({
  setValidator: () => null,
  formErrors: {},
  valid: true,
});

function errorsReducer (errors: FormErrors, { id, error }: FormValidator) {
  const newErrors = {...errors};
  if (error) {
    newErrors[id] = error;
  } else {
    delete newErrors[id];
  }
  return newErrors;
}

export default function FormValidation ({ children }: Props): JSX.Element {
  const [formErrors, setValidator] = useReducer(errorsReducer, {});
  return (
    <Context.Provider value={{
      setValidator,
      formErrors,
      valid: Object.values(formErrors).length < 1,
    }}>
      {children}
    </Context.Provider>
  )
}

interface ConsumerProps {
  children: (value: FormValidationType) => ReactNode;
}

export function FormValidationConsumer ({ children }: ConsumerProps) {
  return (
    <Context.Consumer>
      {children}
    </Context.Consumer>
  );
}

export function useFormValidation (): FormValidationType {
  return useContext(Context);
}

interface ValidatorProps<T> {
  id?: string;
  error: T;
}

export function useFormValidator<T extends string | boolean>({ id, error }: ValidatorProps<T>): T {
  const { setValidator } = useFormValidation();
  const validatorCount = useRef(0);

  const validatorId = useMemo(() => {
    if (id) return id;
    validatorCount.current++;
    return `validator-${validatorCount.current}`;
  }, [id]);

  useEffect(() => {
    setValidator({
      id: validatorId,
      error
    })
  }, [error, setValidator, validatorId]);

  useEffect(() => {
    return () => setValidator({
      id: validatorId,
      error: false
    })
  }, [validatorId, setValidator]);

  return error;
}
