import React from 'react';
import PropTypes from 'prop-types';

class PublicRoute extends React.Component {

  static propTypes = {
    showRefreshing: PropTypes.func.isRequired,
    hideRefreshing: PropTypes.func.isRequired,
  };

  render() {
    const { component: Component } = this.props;

    return (
      <React.Fragment>
        <Component {...this.props} />
      </React.Fragment>
    );
  }

}

export default PublicRoute;
