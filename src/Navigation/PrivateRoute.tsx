import * as React from 'react';
import { Route, Redirect, RouteComponentProps } from 'react-router-dom';

/** Helpers */
import { validateToken } from '../Utils/Helpers';

/** Constants */
import { AUTH_USER_TOKEN_KEY } from '../Utils/constants';

const PrivateRoute = ({ component: Component, ...rest }: any & { component: any }) => {
  const checkUserAuth = validateToken(localStorage.getItem(AUTH_USER_TOKEN_KEY));

  return (
    <Route
      {...rest}
      render={props => {
        return checkUserAuth ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{
              pathname: '/login'
            }}
          />
        );
      }}
    />
  );
};

export default PrivateRoute;
