import React, { useEffect, useState } from "react";
import { fetchData } from "../utils";
import { API_URL } from "../utils/constants";

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

interface StatesData {
  [state_name: string]: CityData[];
}

const SignUpForm: React.FC = () => {
  const [formState, setFormState] = useState(initialState);
  const [states, setStates] = useState<StateData[]>([]);
  const [statesData, setStatesData] = useState<StatesData>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormState((prevState) => ({ ...prevState, [name]: value }));
  };

  const getStateList = async () => {
    const res = await fetchData(`${API_URL}/states/United States`);
    setStates(res);
  };

  const getCityList = async (stateName: string) => {
    if (!statesData[stateName]) {
      const res = await fetchData(
        `https://www.universal-tutorial.com/api/cities/${stateName}`
      );
      setStatesData({
        ...statesData,
        [stateName]: res,
      });
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(formState);
  };

  const handleStateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;
    setFormState((prevState) => ({ ...prevState, state: value, city: "" }));
    if (value) {
      getCityList(value);
    }
  };

  useEffect(() => {
    getStateList();
  }, []);

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
              required
            />
          </div>
          <div className="form-element">
            <input
              type="text"
              name="lastName"
              placeholder="Last Name*"
              value={formState.lastName}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        <div className="form-element">
          <select
            name="state"
            value={formState.state}
            onChange={handleStateChange}
            disabled={!states?.length}
            required
          >
            <option value="">Select a state</option>
            {states?.length &&
              states.map((state) => (
                <option key={state.state_name} value={state.state_name}>
                  {state.state_name}
                </option>
              ))}
          </select>
        </div>
        {formState.state && (
          <div className="form-element">
            <select
              name="city"
              value={formState.city}
              onChange={handleChange}
              disabled={!statesData[formState.state]}
              required
            >
              <option value="">Select a city</option>
              {statesData[formState.state] &&
                statesData[formState.state].map((city) => (
                  <option key={city.city_name} value={city.city_name}>
                    {city.city_name}
                  </option>
                ))}
            </select>
          </div>
        )}
        <div className="form-element">
          <input
            type="email"
            name="email"
            placeholder="Email*"
            value={formState.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-element">
          <input
            type="password"
            name="password"
            placeholder="Password*"
            value={formState.password}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-element">
          <button type="submit" className="btn-signup">
            Sign Up
          </button>
        </div>
      </form>
    </div>
  );
};

export default SignUpForm;
