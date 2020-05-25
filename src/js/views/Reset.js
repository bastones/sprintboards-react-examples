import React from 'react';
import Axios from 'axios';
import PropTypes from 'prop-types';
import SweetAlert from 'sweetalert';
import QueryString from 'query-string';
import Auth from '../../modules/Auth';
import UserAgent from '../../modules/UserAgent';
import RenderError from '../../components/RenderError';
import SubmitButton from '../../components/SubmitButton';
import { Helmet } from 'react-helmet';
import { Link, withRouter } from 'react-router-dom';
import { FontAwesomeIcon as FontAwesome } from '@fortawesome/react-fontawesome';

class Reset extends React.Component {

  static propTypes = {
    showRefreshing: PropTypes.func.isRequired,
    hideRefreshing: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this.emailField = React.createRef();

    this.state = {
      form: {
        email: Auth.user()
          ? Auth.user().email
          : '',
        password: '',
        password_confirmation: '',
        token: '',
      },

      submitting: false,

      errors: {},
    };

    this.onChangeEmail = this.onChangeEmail.bind(this);

    this.onChangePassword = this.onChangePassword.bind(this);
    this.onChangePasswordConfirmation = this.onChangePasswordConfirmation.bind(this);

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
    
    const { history, location } = this.props;

    const queryString = QueryString.parse(location.search);
    const { token } = queryString;

    if (typeof token === typeof undefined) {
      history.push('/auth/login');
    } else {
      const { form } = this.state;

      form.token = token;

      this.setState({
        form,
      });
    }
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

  onChangePasswordConfirmation(e) {
    const { form } = this.state;

    form.password_confirmation = e.target.value;

    this.setState({
      form,
    });
  }

  onSubmit(e) {
    e.preventDefault();

    const { history } = this.props;
    const { form } = this.state;

    this.setState({
      errors: {},
      submitting: true,
    });

    Axios.post(`/auth/reset`, form).then(() => {
      this.setState({
        submitting: false,
      });

      SweetAlert({
        icon: 'success',
        title: 'Done',
        text: Auth.user()
          ? 'Please login with your new password'
          : 'You can now login to your account',
        buttons: false,
        timer: 2000,
      }).then(() => {
        Auth.clear();

        setTimeout(() => {
          history.push('/auth/login', {
            email: form.email,
          });
        }, 200);
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
    });
  }

  renderForm() {
    const { errors, submitting, form } = this.state;

    return (
      <React.Fragment>
        <h2 className="h4 font-weight-normal mb-4">
          Change Password
        </h2>

        <h5 className="font-weight-light mb-3">
          Email Address
        </h5>

        <div className="mb-4">
          <div className="input-group">
            <div className="input-group-prepend">
              <span className="input-group-text">
                <FontAwesome icon="envelope" id="reset_password_email_icon" />
              </span>
            </div>

            <input
              type="email"
              className="form-control"
              placeholder="Required"
              defaultValue={form.email}
              ref={this.emailField}
              onChange={this.onChangeEmail}
              aria-describedby="reset_password_email_icon"
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
                <FontAwesome icon="lock" id="reset_password_lock_icon" />
              </span>
            </div>

            <input
              type="password"
              className="form-control"
              placeholder="Required"
              onChange={this.onChangePassword}
              aria-describedby="reset_password_lock_icon"
              autoFocus={(form.email.length > 0) && !UserAgent.isAndroid() && !UserAgent.isIOS()}
            />
          </div>

          <RenderError errors={errors} field="password" />
        </div>

        <h5 className="font-weight-light mb-3">
          Confirm Password
        </h5>

        <div className="mb-4">
          <div className="input-group">
            <div className="input-group-prepend">
              <span className="input-group-text">
                <FontAwesome icon="lock" id="reset_password_lock_confirmation_icon" />
              </span>
            </div>

            <input
              type="password"
              className="form-control"
              placeholder="Required"
              onChange={this.onChangePasswordConfirmation}
              aria-describedby="reset_password_lock_confirmation_icon"
            />
          </div>

          <RenderError errors={errors} field="password_confirmation" />
        </div>

        <p className="mb-0">
          <SubmitButton value="Change Password" className="btn btn-primary px-4" submitting={submitting} />
        </p>
      </React.Fragment>
    );
  }

  render() {
    return (
      <React.Fragment>
        <Helmet>
          <title>
            Change Password &ndash; Sprint Boards
          </title>

          <style type="text/css">
            {Reset.getStylesheet()}
          </style>
        </Helmet>

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
                    {this.renderForm()}
                  </div>
                </div>

                <p className="small text-center">
                  <Link to="/support/create" target="_blank" rel="noopener noreferrer" className="text-secondary">
                    Contact Support
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

export default withRouter(Reset);
