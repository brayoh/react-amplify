import * as React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

// container components
import DashBoardContainer from '../Containers/DashboardContainer';
import LoginContainer from '../Containers/LoginContainer';
import SignUpContainer from '../Containers/SignUpContainer';
import ConfirmEmailContainer from '../Containers/ConfirmEmailContainer';
import ForgotPasswordContainer from '../Containers/ForgotPasswordContainer';
import PasswordResetContainer from '../Containers/PasswordResetContainer';

// private route component
import PrivateRoute from './PrivateRoute';

class AppRouter extends React.Component {
  render() {
    return (
      <Router>
        <React.Fragment>
          <PrivateRoute
            isAuthenticated={true}
            userRole="member"
            loading={false}
            exact={true}
            path="/"
            authorize={['member', 'stakeholder', 'vendor', 'logistics']}
            component={LoginContainer}
          />

          <PrivateRoute
            isAuthenticated={true}
            userRole="member"
            loading={false}
            exact={true}
            path="/home"
            authorize={['member', 'stakeholder', 'vendor', 'logistics']}
            component={DashBoardContainer}
          />

          <PrivateRoute
            isAuthenticated={true}
            userRole="member"
            loading={false}
            exact={true}
            path="/login"
            authorize={['member', 'stakeholder', 'vendor', 'logistics']}
            component={LoginContainer}
          />

          <PrivateRoute
            isAuthenticated={true}
            userRole="member"
            loading={false}
            exact={true}
            path="/signup"
            authorize={['member', 'stakeholder', 'vendor', 'logistics']}
            component={SignUpContainer}
          />

          <PrivateRoute
            isAuthenticated={true}
            userRole="member"
            loading={false}
            exact={true}
            path="/verify-code"
            authorize={['member', 'stakeholder', 'vendor', 'logistics']}
            component={ConfirmEmailContainer}
          />

          <PrivateRoute
            isAuthenticated={true}
            userRole="member"
            loading={false}
            exact={true}
            path="/reset-password"
            authorize={['member', 'stakeholder', 'vendor', 'logistics']}
            component={PasswordResetContainer}
          />

          <PrivateRoute
            isAuthenticated={true}
            userRole="member"
            loading={false}
            exact={true}
            path="/forgot-password"
            authorize={['member', 'stakeholder', 'vendor', 'logistics']}
            component={ForgotPasswordContainer}
          />
        </React.Fragment>
      </Router>
    );
  }
}

export default AppRouter;
