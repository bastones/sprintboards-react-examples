import React from 'react';
import Axios from 'axios';
import PropTypes from 'prop-types';
import SweetAlert from 'sweetalert';
import Auth from '../../modules/Auth';
import UserAgent from '../../modules/UserAgent';
import SubmitButton from '../../components/SubmitButton';
import DelayedButton from '../../components/DelayedButton';
import RenderError from '../../components/RenderError';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon as FontAwesome } from '@fortawesome/react-fontawesome';

class Forgot extends React.Component {

  static propTypes = {
    showRefreshing: PropTypes.func.isRequired,
    hideRefreshing: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      form: {
        email: Auth.user()
          ? Auth.user().email
          : '',
      },

      delay: 90,

      submitting: false,
      sent: false,

      errors: {},
    };

    this.field = React.createRef();

    this.onChangeEmail = this.onChangeEmail.bind(this);
    this.onClickResend = this.onClickResend.bind(this);
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

  onClickResend(e) {
    this.setState({
      submitting: true,
    });

    this.onSubmit(e).then(() => {
      this.setState({
        delay: 90,
        submitting: false,
      });

      SweetAlert({
        icon: 'success',
        title: 'Sent',
        text: 'Please also check your spam folder',
        buttons: false,
        timer: 2000,
      });
    });
  }

  onSubmit(e) {
    return new Promise((resolve, reject) => {
      e.preventDefault();

      const { form } = this.state;

      this.setState({
        errors: {},
        submitting: true,
      });

      Axios.post('/auth/forgot', form).then(() => {
        this.setState({
          sent: true,
          submitting: false,
        });

        resolve();
      }).catch(error => {
        reject(error);

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
          this.field.current.focus();
        }
      });
    });
  }

  renderForm() {
    const {
      sent,
      form,
      delay,
      errors,
      submitting,
    } = this.state;

    if (!sent) {
      return (
        <React.Fragment>
          <h2 className="h4 font-weight-normal mb-4">
            Reset Password
          </h2>

          <h5 className="font-weight-light mb-3">
            Email Address
          </h5>

          <div className="mb-4">
            <div className="input-group">
              <div className="input-group-prepend">
                <span className="input-group-text">
                  <FontAwesome icon="envelope" id="forgot_email_icon" />
                </span>
              </div>

              <input
                type="email"
                className="form-control"
                placeholder="Required"
                defaultValue={form.email}
                ref={this.field}
                onChange={this.onChangeEmail}
                aria-describedby="forgot_email_icon"
                autoFocus={!UserAgent.isAndroid() && !UserAgent.isIOS()}
              />
            </div>

            <RenderError errors={errors} field="email" />
          </div>

          <p className="mb-0">
            <SubmitButton value="Send" className="btn btn-primary px-4" submitting={submitting} />
          </p>
        </React.Fragment>
      );
    }

    return (
      <React.Fragment>
        <h2 className="h4 font-weight-normal mb-3">
          Email Sent!
        </h2>

        <p>
          Please check your inbox to change your password.
        </p>

        <p className="mb-0">
          <DelayedButton
            value="Resend"
            currentDelay={delay}
            decrementDelay={() => {
              this.setState({
                delay: delay - 1,
              });
            }}
            submitting={submitting}
            onClick={this.onClickResend}
          />
        </p>
      </React.Fragment>
    );
  }

  render() {
    return (
      <React.Fragment>
        <Helmet>
          <title>
            Reset Password &ndash; Sprint Boards
          </title>

          <style type="text/css">
            {Forgot.getStylesheet()}
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

                {Auth.user() && (
                  <p className="small text-center">
                    <Link to="/support/create" className="text-secondary">
                      Contact Support
                    </Link>
                  </p>
                )}

                {!Auth.user() && (
                  <p className="small text-center">
                    <Link to="/auth/login" className="text-secondary">
                      Remember Password? Login Here
                    </Link>
                  </p>
                )}
              </div>
            </div>
          </form>
        </div>
      </React.Fragment>
    );
  }

}

export default Forgot;
