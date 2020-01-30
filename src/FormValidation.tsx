import React, { useContext, useMemo, useEffect, useCallback, useState, ReactNode, useRef } from 'react';

interface FormValidationType {
  errors: Record<string, string | boolean>;
  setError: (id: string, error: string | boolean) => void;
  valid: boolean;
};

interface Props {
  children: JSX.Element | JSX.Element[];
}

const Context = React.createContext<FormValidationType>({
  setError: () => null,
  errors: {},
  valid: true,
});

export default function FormValidation ({ children }: Props): JSX.Element {
  const [errors, setErrors] = useState<Record<string, string | boolean>>({})

  const setError = useCallback((id: string, error: string | boolean) => {
    setErrors(prevErrors => {
      const newErrors = {...prevErrors};
      if (error) {
        newErrors[id] = error;
      } else {
        delete newErrors[id];
      }
      return newErrors;
    });
  }, [setErrors]);

  return (
    <Context.Provider value={{
      setError,
      errors,
      valid: Object.values(errors).length < 1,
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
  const { setError } = useFormValidation();
  const validatorCount = useRef(0);

  const validatorId = useMemo(() => {
    if (id) return id;
    validatorCount.current++;
    return `validator-${validatorCount.current}`;
  }, [id]);

  useEffect(() => {
    setError(validatorId, error || false)
  }, [error, setError, validatorId]);

  useEffect(() => {
    return () => setError(validatorId, false)
  }, [validatorId, setError]);

  return error;
}
