import { createContext, useContext, useEffect, useReducer, useRef } from 'react';
import PropTypes from 'prop-types';
import config from "./../../global.config";
import axios from "axios";
const HANDLERS = {
  INITIALIZE: 'INITIALIZE',
  SIGN_IN: 'SIGN_IN',
  SIGN_OUT: 'SIGN_OUT'
};

const initialState = {
  isAuthenticated: false,
  isLoading: true,
  user: null
};

const handlers = {
  [HANDLERS.INITIALIZE]: (state, action) => {
    const user = action.payload;

    return {
      ...state,
      ...(
        // if payload (user) is provided, then is authenticated
        user
          ? ({
            isAuthenticated: true,
            isLoading: false,
            user
          })
          : ({
            isLoading: false
          })
      )
    };
  },
  [HANDLERS.SIGN_IN]: (state, action) => {
    const user = action.payload;

    return {
      ...state,
      isAuthenticated: true,
      user
    };
  },
  [HANDLERS.SIGN_OUT]: (state) => {
    return {
      ...state,
      isAuthenticated: false,
      user: null
    };
  }
};

const reducer = (state, action) => (
  handlers[action.type] ? handlers[action.type](state, action) : state
);

// The role of this context is to propagate authentication state through the App tree.

export const AuthContext = createContext({ undefined });

export const AuthProvider = (props) => {
  const { children } = props;
  const [state, dispatch] = useReducer(reducer, initialState);
  const initialized = useRef(false);

  const initialize = async () => {
    // Prevent from calling twice in development mode with React.StrictMode enabled
    if (initialized.current) {
      return;
    }

    initialized.current = true;

    let isAuthenticated = false;

    try {
      isAuthenticated = localStorage.getItem("user") ? true : false;
    } catch (err) {
      console.error(err);
    }

    if (isAuthenticated) {
      const userStr = localStorage.getItem("user");
      if (userStr) {
        const user = JSON.parse(userStr);
        axios.defaults.headers.common['Authorization'] = `Bearer ${user.token}`;
        dispatch({
          type: HANDLERS.INITIALIZE,
          payload: user
        });
      }

    } else {
      dispatch({
        type: HANDLERS.INITIALIZE
      });
    }
  };

  useEffect(
    () => {
      initialize();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const signIn = async (name, password) => {
    return axios.post("/api/auth/signin", {
      "username": name,
      "password": password
    }).then(response => {
      if (response.data.token) {
        localStorage.setItem("user", JSON.stringify(response.data));
        axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
        const user = {
          id: response.data.id,
          username: response.data.username,
          token: response.data.token,
          user_type: response.data.user_type,
          bankNumber: response.data.bankNumber,
          balance_eur: response.data.balance_eur,
          balance_usd: response.data.balance_usd,
          balance_gbp: response.data.balance_gbp
        };

        dispatch({
          type: HANDLERS.SIGN_IN,
          payload: user
        });
      }
    });
  };

  const signUp = async (bankNumber, name, password) => {
    return axios.post("/api/auth/signup", {
      "username": name,
      "bankNumber": bankNumber,
      "password": password
    })

    // throw new Error('Sign up is not implemented');
  };

  const signOut = () => {
    localStorage.removeItem("user");
    delete axios.defaults.headers.common["Authorization"];
    dispatch({
      type: HANDLERS.SIGN_OUT
    });
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        signIn,
        signUp,
        signOut
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node
};

export const AuthConsumer = AuthContext.Consumer;

export const useAuthContext = () => useContext(AuthContext);
