import React, { useState } from "react";
import useFetchData from "../hooks/useFetchData";
import { getCityAPIURL, getStateAPIURL } from "../utils";

interface SignUpFormState {
  firstName: string;
  lastName: string;
  state: string;
  city: string;
  email: string;
  password: string;
}

const initialState: SignUpFormState = {
  firstName: "",
  lastName: "",
  state: "",
  city: "",
  email: "",
  password: "",
};

interface StateData {
  state_name: string;
}

interface CityData {
  city_name: string;
}

const SignUpForm: React.FC = () => {
  const [formState, setFormState] = useState(initialState);
  const [errors, setErrors] = useState<Partial<SignUpFormState>>({});
  const { data: states, isLoading: isStateLoading } = useFetchData<StateData[]>(
    getStateAPIURL("United States")
  );
  const { data: cities, isLoading: isCityLoading } = useFetchData<CityData[]>(
    getCityAPIURL(formState.state)
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormState((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const validationErrors: Partial<SignUpFormState> = {};

    Object.keys(formState).forEach((key) => {
      if (!formState[key as keyof SignUpFormState]) {
        validationErrors[key as keyof SignUpFormState] =
          "This field is required";
      }
    });

    if (!/\S+@\S+\.\S+/.test(formState.email)) {
      validationErrors.email = "Invalid email address";
    }

    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) {
      return;
    }
    console.log(formState);
  };

  const handleStateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;
    setFormState((prevState) => ({ ...prevState, state: value, city: "" }));
  };

  return (
    <div>
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit}>
        <div className="rows">
          <div className="form-element">
            <input
              type="text"
              name="firstName"
              placeholder="First Name*"
              value={formState.firstName}
              onChange={handleChange}
            />
            {errors.firstName && (
              <p className="validation-error">{errors.firstName}</p>
            )}
          </div>
          <div className="form-element">
            <input
              type="text"
              name="lastName"
              placeholder="Last Name*"
              value={formState.lastName}
              onChange={handleChange}
            />
            {errors.lastName && (
              <p className="validation-error">{errors.lastName}</p>
            )}
          </div>
        </div>
        <div className="form-element">
          <select
            name="state"
            value={formState.state}
            onChange={handleStateChange}
            disabled={isStateLoading}
          >
            <option value="">Select a state</option>
            {!isStateLoading &&
              states?.length &&
              states.map((state, index) => (
                <option
                  key={`${state.state_name}-${index}`}
                  value={state.state_name}
                >
                  {state.state_name}
                </option>
              ))}
          </select>
          {errors.state && <p className="validation-error">{errors.state}</p>}
        </div>
        {formState.state && (
          <div className="form-element">
            <select
              name="city"
              value={formState.city}
              onChange={handleChange}
              disabled={isCityLoading}
            >
              <option value="">Select a city</option>
              {!isCityLoading &&
                cities?.length &&
                cities.map((city, index) => (
                  <option
                    key={`${city.city_name}-${index}`}
                    value={city.city_name}
                  >
                    {city.city_name}
                  </option>
                ))}
            </select>
            {errors.city && <p className="validation-error">{errors.city}</p>}
          </div>
        )}
        <div className="form-element">
          <input
            type="text"
            name="email"
            placeholder="Email*"
            value={formState.email}
            onChange={handleChange}
          />
          {errors.email && <p className="validation-error">{errors.email}</p>}
        </div>
        <div className="form-element">
          <input
            type="password"
            name="password"
            placeholder="Password*"
            value={formState.password}
            onChange={handleChange}
          />
          {errors.password && (
            <p className="validation-error">{errors.password}</p>
          )}
        </div>
        <div className="form-element">
          <button
            type="submit"
            className="btn-signup"
            disabled={isStateLoading || isCityLoading}
          >
            Sign Up
          </button>
        </div>
      </form>
    </div>
  );
};

export default SignUpForm;
