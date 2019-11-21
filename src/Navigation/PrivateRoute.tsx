import * as React from 'react';
import { Route, Redirect } from 'react-router-dom';

const PrivateRoute = (props: any) => {
  const { isAuthenticated, authorize, userRole, loading, component } = props;
  const Component = component;

  // usergroups
  const roles: Array<string> = ['member', 'stakeholder', 'vendor', 'logistics'];

  // check if user is authorized to view route
  const checkUserAuthorized = () =>
    roles.some(
      role => authorize.includes(role) && authorize.includes(userRole)
    );

  const userAuthCheck = isAuthenticated && checkUserAuthorized();

  return (
    <Route
      {...props}
      render={props =>
        userAuthCheck ? (
          <Component {...props} />
        ) : (
          !loading && (
            <Redirect
              to={{
                pathname: '/login',
                state: { from: props.location }
              }}
            />
          )
        )
      }
    />
  );
};

export default PrivateRoute;
