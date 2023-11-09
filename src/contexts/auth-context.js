import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useRef,
} from 'react';

import PropTypes from 'prop-types';

import { signInWithGooglePopup } from '@/Firebase';

import AuthService from '../services/auth';
import UserService from '../services/user';

const HANDLERS = {
  INITIALIZE: 'INITIALIZE',
  SIGN_IN: 'SIGN_IN',
  SIGN_OUT: 'SIGN_OUT',
};

const initialState = {
  isAuthenticated: false,
  isLoading: true,
  user: null,
};

const handlers = {
  [HANDLERS.INITIALIZE]: (state, action) => {
    const user = action.payload;

    return {
      ...state,
      ...// if payload (user) is provided, then is authenticated
      (user
        ? {
            isAuthenticated: true,
            isLoading: false,
            user,
          }
        : {
            isLoading: false,
          }),
    };
  },
  [HANDLERS.SIGN_IN]: (state, action) => {
    const user = action.payload;

    return {
      ...state,
      isAuthenticated: true,
      user,
    };
  },
  [HANDLERS.SIGN_OUT]: (state) => {
    return {
      ...state,
      token: null,
      isAuthenticated: false,
      user: null,
    };
  },
};

const reducer = (state, action) =>
  handlers[action.type] ? handlers[action.type](state, action) : state;

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
    let token = null;

    try {
      isAuthenticated =
        window.sessionStorage.getItem('authenticated') === 'true';
      token = window.sessionStorage.getItem('token');
    } catch (err) {
      console.error(err);
    }

    if (isAuthenticated && token) {
      const requestHeader = {
        Authorization: `Bearer ${token}`,
      };

      const userInfo = await new UserService(requestHeader).getById('me');
      const user = {
        ...userInfo,
        token,
      };

      dispatch({
        type: HANDLERS.INITIALIZE,
        payload: user,
      });
    } else {
      dispatch({
        type: HANDLERS.INITIALIZE,
      });
    }
  };

  useEffect(
    () => {
      initialize();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  // const skip = () => {
  //   try {
  //     window.sessionStorage.setItem('authenticated', 'true');
  //   } catch (err) {
  //     console.error(err);
  //   }

  //   const user = {
  //     id: '5e86809283e28b96d2d38537',
  //     avatar: '/assets/avatars/avatar-anika-visser.png',
  //     name: 'Phạm Nguyên',
  //     email: 'nguyengl176@gmail.com',
  //   };

  //   dispatch({
  //     type: HANDLERS.SIGN_IN,
  //     payload: user,
  //   });
  // };

  const signInWithPassword = async (email, password) => {
    // if (email !== 'nguyengl176@gmail.com' || password !== 'nguyen123') {
    //   throw new Error('Please check your email and password');
    // }

    const response = await AuthService.signIn(email, password);
    if (!response) {
      throw new Error('Please check your email and password');
    }
    const requestHeader = {
      Authorization: `Bearer ${response}`,
    };

    const userInfo = await new UserService(requestHeader).getById('me');
    try {
      window.sessionStorage.setItem('authenticated', 'true');
      window.sessionStorage.setItem('token', response);
    } catch (err) {
      console.error(err);
    }

    const user = {
      ...userInfo,
      token: response,
    };

    dispatch({
      type: HANDLERS.SIGN_IN,
      payload: user,
    });
  };

  const signInWithGoogle = async () => {
    const idToken = await signInWithGooglePopup();
    // console.log('id token', idToken);
    const response = await AuthService.signInGoogle(idToken, '');
    console.log('login google', response);
    if (!response) {
      throw new Error('Please check your email and password');
    }
    const requestHeader = {
      Authorization: `Bearer ${response}`,
    };

    const userInfo = await new UserService(requestHeader).getById('me');
    try {
      window.sessionStorage.setItem('authenticated', 'true');
    } catch (err) {
      console.error(err);
    }

    const user = {
      ...userInfo,
      token: response,
    };
    console.log(user);

    dispatch({
      type: HANDLERS.SIGN_IN,
      payload: user,
    });
  };

  const signUp = async (email, name, password) => {
    throw new Error('Sign up is not implemented');
  };

  const signOut = () => {
    window.sessionStorage.removeItem('token');
    window.sessionStorage.removeItem('authenticated');

    dispatch({
      type: HANDLERS.SIGN_OUT,
    });
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        // skip,
        signInWithPassword,
        signInWithGoogle,
        signUp,
        signOut,
      }}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node,
};

export const AuthConsumer = AuthContext.Consumer;

export const useAuthContext = () => useContext(AuthContext);
