import React from 'react';
import Axios from 'axios';
import Cookie from 'js-cookie';
import ReactGA from 'react-ga';
import Loadable from 'react-loadable';
import GuestRoute from './components/routes/GuestRoute';
import PublicRoute from './components/routes/PublicRoute';
import { Switch, withRouter } from 'react-router-dom';

const Login = Loadable({
  loader: () => Promise.all([
    import('./views/auth/Login'),
    new Promise(resolve => setTimeout(resolve, 200)),
  ]).then(([component]) => component),

  loading: PageLoading,

  timeout: 5000,
});

const Forgot = Loadable({
  loader: () => Promise.all([
    import('./views/auth/Forgot'),
    new Promise(resolve => setTimeout(resolve, 200)),
  ]).then(([component]) => component),

  loading: PageLoading,

  timeout: 5000,
});

const Reset = Loadable({
  loader: () => Promise.all([
    import('./views/auth/Reset'),
    new Promise(resolve => setTimeout(resolve, 200)),
  ]).then(([component]) => component),

  loading: PageLoading,

  timeout: 5000,
});

class Pages extends React.Component {

  constructor(props) {
    super(props);

    this.showRefreshing = this.showRefreshing.bind(this);
    this.hideRefreshing = this.hideRefreshing.bind(this);

    this.state = {
      refreshing: false,
    };
  }

  static loadStripeCheckout() {
    const script = document.createElement('script');

    script.src = 'https://js.stripe.com/v3';

    document.body.appendChild(script);
  }

  componentDidMount() {
    this.setAxiosDefaults();

    this.loadGoogleAnalytics();

    Pages.loadStripeCheckout();
  }

  setAxiosDefaults() {
    Axios.defaults.baseURL = process.env.REACT_APP_API_URL;

    if (Cookie.get('api_token')) {
      Axios.defaults.headers.common.Authorization = `Bearer ${Cookie.get('api_token')}`;
    }

    Axios.interceptors.response.use(response => response, error => {
      if (typeof error.response !== typeof undefined) {
        const status = error.response.status;

        if (status === 401) {
          const { history } = this.props;

          Cookie.remove('api_token');

          history.push('/auth/login', { error: 'Your session has expired.' });
        } else if (status === 429) {
          setTimeout(() => {
            window.toastr.error('Too many requests. Wait a minute.');
          }, 3000);
        } else if (status === 403) {
          window.toastr.error('You are not authorised to do that.');
        } else if (status !== 422) {
          window.toastr.error('API request failed. Please try again.');
        }
      }

      return Promise.reject(error);
    });
  }

  loadGoogleAnalytics() {
    const { history, location } = this.props;

    ReactGA.initialize(process.env.REACT_APP_GOOGLE_ANALYTICS_ID);

    const setAnalytics = location => {
      ReactGA.set({
        page: location.pathname,
        title: location.pathname,
        anonymizeIp: true,
      });

      ReactGA.pageview(window.location.pathname + window.location.search);
    };

    history.listen(location => {
      setAnalytics(location);
    });

    setAnalytics(location);
  }

  showRefreshing() {
    this.setState({
      refreshing: true,
    });
  }

  hideRefreshing() {
    this.setState({
      refreshing: false,
    });
  }

  render() {
    return (
      <ScrollTop>
        <Switch>
          <GuestRoute
            exact
            path="/auth/login"
            showRefreshing={this.showRefreshing}
            hideRefreshing={this.hideRefreshing}
            component={Login}
          />

          <PublicRoute
            exact
            path="/auth/forgot"
            showRefreshing={this.showRefreshing}
            hideRefreshing={this.hideRefreshing}
            component={Forgot}
          />

          <PublicRoute
            exact
            path="/auth/reset"
            showRefreshing={this.showRefreshing}
            hideRefreshing={this.hideRefreshing}
            component={Reset}
          />
        </Switch>
      </ScrollTop>
    );
  }

}

export default withRouter(Pages);
