import React from 'react';
import Axios from 'axios';
import Cookie from 'js-cookie';
import PropTypes from 'prop-types';
import UserAgent from '../../modules/UserAgent';
import RenderError from '../../components/RenderError';
import SubmitButton from '../../components/SubmitButton';
import RedirectAlert from '../../components/RedirectAlert';
import { Helmet } from 'react-helmet';
import { Link, withRouter } from 'react-router-dom';
import { FontAwesomeIcon as FontAwesome } from '@fortawesome/react-fontawesome';

class Login extends React.Component {

  static propTypes = {
    showRefreshing: PropTypes.func.isRequired,
    hideRefreshing: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    const { location } = props;

    this.state = {
      form: {
        email: typeof location.state !== typeof undefined && typeof location.state.email !== typeof undefined
          ? location.state.email
          : '',
        password: '',
      },

      errors: {},

      submitting: false,
    };

    this.fields = {
      email: React.createRef(),
    };

    this.onChangeEmail = this.onChangeEmail.bind(this);
    this.onChangePassword = this.onChangePassword.bind(this);

    this.onSubmit = this.onSubmit.bind(this);
  }

  static getStylesheet() {
    return `
      body {
        background-color: #f5f5f5;
      }
    `;
  }

  componentDidMount() {
    UserAgent.showBrowserCompatibilityWarning();
  }

  onChangeEmail(e) {
    const { form } = this.state;

    form.email = e.target.value;

    this.setState({
      form,
    });
  }

  onChangePassword(e) {
    const { form } = this.state;

    form.password = e.target.value;

    this.setState({
      form,
    });
  }

  onSubmit(e) {
    e.preventDefault();

    const { form } = this.state;

    this.setState({
      errors: {},
      submitting: true,
    });

    Axios.post('/auth/login', form).then(response => {
      const { history } = this.props;
      const { user, token, subscription } = response.data;

      Cookie.set('api_token', token);
      Cookie.set('user', JSON.stringify(user));

      Axios.defaults.headers.common.Authorization = `Bearer ${token}`;

      if (user.is_subscribed) {
        Cookie.set('subscription', JSON.stringify(subscription));
      } else {
        Cookie.remove('subscription');
      }

      this.setState({
        submitting: false,
      });

      history.push('/', {
        alert: {
          success: 'Success! You are now logged in.',
        },
      });
    }).catch(error => {
      const { data } = error.response;

      this.setState({
        submitting: false,
      });

      if (typeof data.errors !== typeof undefined) {
        this.setState({
          errors: data.errors,
        });
      }

      if (!UserAgent.isAndroid() && !UserAgent.isIOS()) {
        this.fields.email.current.focus();
      }
    });
  }

  render() {
    const { location } = this.props;
    const { submitting, errors, form } = this.state;

    return (
      <React.Fragment>
        <Helmet>
          <title>
            Login &ndash; Sprint Boards
          </title>

          <style type="text/css">
            {Login.getStylesheet()}
          </style>
        </Helmet>

        <RedirectAlert location={location} />

        <div className="container pt-5 pb-4">
          <div className="w-100 mb-4 text-center">
            <Link to="/" className="text-center mb-4 p-2">
              <img src={`${process.env.PUBLIC_URL}/images/logo-inverse.png`} alt="Sprint Boards" width={170} />
            </Link>
          </div>

          <form onSubmit={this.onSubmit}>
            <div className="row">
              <div className="col-xl-5 col-lg-6 col-md-7 col-sm-12 m-auto">
                <div className="card shadow-sm border-0 mb-4">
                  <div className="card-body px-4 py-4">
                    <h2 className="h4 font-weight-normal mb-3">
                      Login
                    </h2>

                    <h5 className="font-weight-light mb-3">
                      Email Address
                    </h5>

                    <div className="mb-4">
                      <div className="input-group">
                        <div className="input-group-prepend">
                          <span className="input-group-text">
                            <FontAwesome icon="envelope" id="login_email_icon" />
                          </span>
                        </div>

                        <input
                          type="email"
                          className={
                            typeof errors.email !== typeof undefined
                              ? 'form-control is-invalid'
                              : 'form-control'
                          }
                          placeholder="Required"
                          ref={this.fields.email}
                          defaultValue={form.email}
                          onChange={this.onChangeEmail}
                          aria-describedby="login_email_icon"
                          autoFocus={(form.email.length === 0) && !UserAgent.isAndroid() && !UserAgent.isIOS()}
                        />
                      </div>

                      <RenderError errors={errors} field="email" />
                    </div>

                    <h5 className="font-weight-light mb-3">
                      Password
                    </h5>

                    <div className="mb-4">
                      <div className="input-group">
                        <div className="input-group-prepend">
                          <span className="input-group-text">
                            <FontAwesome icon="lock" id="login_lock_icon" />
                          </span>
                        </div>

                        <input
                          type="password"
                          className={
                            typeof errors.password !== typeof undefined
                              ? 'form-control is-invalid'
                              : 'form-control'
                          }
                          placeholder="Required"
                          onChange={this.onChangePassword}
                          aria-describedby="login_lock_icon"
                          autoFocus={(form.email.length > 0) && !UserAgent.isAndroid() && !UserAgent.isIOS()}
                        />
                      </div>

                      <RenderError errors={errors} field="password" />
                    </div>

                    <div className="w-100 d-flex flex-row justify-content-between">
                      <SubmitButton value="Login" className="btn btn-primary px-4" submitting={submitting} />

                      <Link to="/auth/forgot" className="btn btn-outline-secondary">
                        Forgot?
                      </Link>
                    </div>
                  </div>
                </div>

                <p className="small text-center">
                  <Link to="/auth/register" className="text-secondary">
                    Not Registered? Create Account
                  </Link>
                </p>
              </div>
            </div>
          </form>
        </div>
      </React.Fragment>
    );
  }

}

export default withRouter(Login);
