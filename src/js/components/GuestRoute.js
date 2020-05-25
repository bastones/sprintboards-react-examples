import React from 'react';
import PropTypes from 'prop-types';
import Auth from '../../modules/Auth';
import { Redirect } from 'react-router-dom';

class GuestRoute extends React.Component {

  static propTypes = {
    showRefreshing: PropTypes.func.isRequired,
    hideRefreshing: PropTypes.func.isRequired,
  };

  render() {
    const { component: Component, location } = this.props;

    return (
      ! Auth.user()
        ? <Component {...this.props} />
        : <Redirect to={{ pathname: '/', state: { from: location } }} />
    );
  }

}

export default GuestRoute;
