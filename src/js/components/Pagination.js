import React from 'react';
import PropTypes from 'prop-types';
import QueryString from 'query-string';
import { Link, withRouter } from 'react-router-dom';

class Pagination extends React.Component {

  static propTypes = {
    data: PropTypes.object.isRequired,
    className: PropTypes.string,
    queryName: PropTypes.string,
    centered: PropTypes.bool,
  };

  static defaultProps = {
    className: 'mb-0',
    queryName: 'page',
    centered: false,
  };

  getQueryParams() {
    const { location } = this.props;

    return QueryString.parse(location.search);
  }

  getPrevPageUrl() {
    const { queryName } = this.props;
    
    const queryParams = this.getQueryParams();

    queryParams[queryName] = parseInt(queryParams[queryName] || 1) - 1;

    return `?${QueryString.stringify(queryParams)}`;
  }

  getNextPageUrl() {
    const { queryName } = this.props;
    
    const queryParams = this.getQueryParams();

    queryParams[queryName] = parseInt(queryParams[queryName] || 1) + 1;

    return `?${QueryString.stringify(queryParams)}`;
  }

  render() {
    const {
      data,
      centered,
      queryName,
      className,
    } = this.props;

    const currentPage = parseInt(this.getQueryParams()[queryName] || 1);

    const items = [];

    for (let count = 1; count <= data.meta.last_page; count++) {
      items.push((
        <li key={count} className={currentPage === count ? 'page-item active' : 'page-item'}>
          <Link to={`?${queryName}=${count}`} className="page-link">
            {count}
          </Link>
        </li>
      ));
    }

    return (
      <nav aria-label="Page Navigation">
        <ul className={`pagination ${centered ? 'justify-content-center' : ''} ${className}`}>
          <li className={currentPage === 1 ? 'page-item disabled' : 'page-item'}>
            <Link to={this.getPrevPageUrl()} className="page-link">
              Prev
            </Link>
          </li>

          {items.map(item => item)}

          <li className={currentPage === data.meta.last_page ? 'page-item disabled' : 'page-item'}>
            <Link to={this.getNextPageUrl()} className="page-link">
              Next
            </Link>
          </li>
        </ul>
      </nav>
    );
  }

}

export default withRouter(Pagination);
