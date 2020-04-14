import React from 'react';
import PropTypes from 'prop-types';
import { createSubscribedElement } from './UnstatedUtils';
import AppContainer from '../services/AppContainer';

class LoginForm extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
    };

  }

  componentDidMount() {
  }

  componentWillUnmount() {
  }

  render() {

    return (
      <div className="main container-fluid">

        {/*  <div class="row">
    <div class="col-md-12">
      <div class="login-header mx-auto">
        <div class="logo mb-3">{% include 'widget/logo.html' %}</div>
        <h1>{{ appService.getAppTitle() }}</h1>

        <div class="row">
          <div class="login-form-errors col-12">
            {% if isLdapSetupFailed() %}
            <div class="alert alert-warning small">
              <strong><i class="icon-fw icon-info"></i>LDAP is enabled but the configuration has something wrong.</strong>
              <br>
              (Please set the environment variables <code>DEBUG=crowi:service:PassportService</code> to get the logs)
            </div>
            {% endif %}

            {#
            # The case that there already exists a user whose username matches ID of the newly created LDAP user
            # https://github.com/weseek/growi/issues/193
            #}
            {% set failedProviderForDuplicatedUsernameException = req.flash('provider-DuplicatedUsernameException') %}
            {% if failedProviderForDuplicatedUsernameException != null %}
            <div class="alert alert-warning small">
              <p><strong><i class="icon-fw icon-ban"></i>DuplicatedUsernameException occured</strong></p>
              <p>
                Your {{ failedProviderForDuplicatedUsernameException }} authentication was succeess, but a new user could not be created.
                See the issue <a href="https://github.com/weseek/growi/issues/193">#193</a>.
              </p>
            </div>
            {% endif %}

            {% set success = req.flash('successMessage') %}
            {% if success.length %}
            <div class="alert alert-success">
              {{ success }}
            </div>
            {% endif %}

            {% set warn = req.flash('warningMessage') %}
            {% if warn.length %}
            {% for w in warn %}
            <div class="alert alert-warning">
              {{ w }}
            </div>
            {% endfor %}
            {% endif %}

            {% set error = req.flash('errorMessage') %}
            {% if error.length %}
            {% for e in error %}
            <div class="alert alert-danger">
              {{ e }}
            </div>
            {% endfor %}
            {% endif %}

            {% if req.form.errors.length > 0 %}
            <div class="alert alert-danger">
              <ul>
              {% for error in req.form.errors %}
                <li>{{ error }}</li>
              {% endfor %}
              </ul>
            </div>
            {% endif %}
          </div>
          <div id="register-form-errors">
            {% set message = req.flash('registerWarningMessage') %}
            {% if message.length %}
            <div class="alert alert-danger">
              {% for msg in message %}
              {{ msg }}<br>
              {% endfor  %}
            </div>
            {% endif %}
          </div>
        </div>
     </div>
      <div class="row mb-5">
        <div class="col-md-12">

        {% set isLocalOrLdapStrategiesEnabled = passportService.isLocalStrategySetup || passportService.isLdapStrategySetup %}
        {% set isExternalAuthCollapsible = isLocalOrLdapStrategiesEnabled %}
        {% set isRegistrationEnabled = passportService.isLocalStrategySetup && getConfig('crowi', 'security:registrationMode') != 'Closed' %}

          <div class="login-dialog mx-auto flipper {% if req.query.register or req.body.registerForm or isRegistering %}to-flip{% endif %}" id="login-dialog">

            <div class="col-12">
              <div class="front">

                {% if isLocalOrLdapStrategiesEnabled %}
                <form role="form" action="/login" method="post">

                  <div class="input-group mb-3">
                    <div class="input-group-prepend">
                      <span class="input-group-text"><i class="icon-user"></i></span>
                    </div>
                    <input type="text" class="form-control" placeholder="Username or E-mail" name="loginForm[username]">
                    {% if passportService.isLdapStrategySetup %}
                    <div class="input-group-append">
                      <small class="input-group-text text-success">
                        <i class="icon-fw icon-check"></i> LDAP
                      </small>
                    </div>
                    {% endif %}
                  </div>

                  <div class="input-group">
                    <div class="input-group-prepend">
                      <span class="input-group-text"><i class="icon-lock"></i></span>
                    </div>
                    <input type="password" class="form-control" placeholder="Password" name="loginForm[password]">
                  </div>

                  <div class="input-group justify-content-center d-flex mt-5">
                    <input type="hidden" name="_csrf" value="{{ csrf() }}">
                    <button type="submit" class="btn btn-fill login px-0 py-2">
                      <div class="eff"></div>
                      <span class="btn-label p-3"><i class="icon-login"></i></span>
                      <span class="btn-label-text p-3">{{ t('Sign in') }}</span>
                    </button>
                  </div>

                </form>
                {% endif %}

                {% if (
                  getConfig('crowi', 'security:passport-google:isEnabled') ||
                  getConfig('crowi', 'security:passport-github:isEnabled') ||
                  getConfig('crowi', 'security:passport-facebook:isEnabled') ||
                  getConfig('crowi', 'security:passport-twitter:isEnabled')||
                  getConfig('crowi', 'security:passport-oidc:isEnabled') ||
                  getConfig('crowi', 'security:passport-saml:isEnabled') ||
                  getConfig('crowi', 'security:passport-basic:isEnabled')
                ) %}
                <div class="border-bottom"></div>
                <div id="external-auth" class="external-auth {% if isExternalAuthCollapsible %}collapse collapse-external-auth collapse-anchor{% endif %}">
                  <div class="spacer"></div>
                  <div class="d-flex flex-row justify-content-between flex-wrap">
                    {% if getConfig('crowi', 'security:passport-google:isEnabled') %}
                    <div class="input-group justify-content-center d-flex mt-5">
                      <form role="form" action="/passport/google" class="d-inline-flex flex-column">
                        <button type="submit" class="btn btn-fill px-0 py-2" id="google">
                          <div class="eff"></div>
                          <span class="btn-label p-3"><i class="fa fa-google"></i></span>
                          <span class="btn-label-text p-3">{{ t('Sign in') }}</span>
                        </button>
                        <div class="small text-center">by Google Account</div>
                      </form>
                    </div>
                    {% endif %}
                    {% if getConfig('crowi', 'security:passport-github:isEnabled') %}
                    <div class="input-group justify-content-center d-flex mt-5">
                      <form role="form" action="/passport/github" class="d-inline-flex flex-column">
                        <input type="hidden" name="_csrf" value="{{ csrf() }}">
                        <button type="submit" class="btn btn-fill px-0 py-2" id="github">
                          <div class="eff"></div>
                          <span class="btn-label p-3"><i class="fa fa-github"></i></span>
                          <span class="btn-label-text p-3">{{ t('Sign in') }}</span>
                        </button>
                        <div class="small text-center">by GitHub Account</div>
                      </form>
                    </div>
                    {% endif %}
                    {% if getConfig('crowi', 'security:passport-facebook:isEnabled') %}
                    <div class="input-group justify-content-center d-flex mt-5">
                      <form role="form" action="/passport/facebook" class="d-inline-flex flex-column">
                        <input type="hidden" name="_csrf" value="{{ csrf() }}">
                        <button type="submit" class="btn btn-fill px-0 py-2" id="facebook">
                          <div class="eff"></div>
                          <span class="btn-label p-3"><i class="fa fa-facebook"></i></span>
                          <span class="btn-label-text p-3">{{ t('Sign in') }}</span>
                        </button>
                        <div class="small text-center">by Facebook Account</div>
                      </form>
                    </div>
                    {% endif %}
                    {% if getConfig('crowi', 'security:passport-twitter:isEnabled') %}
                    <div class="input-group justify-content-center d-flex mt-5">
                      <form role="form" action="/passport/twitter" class="d-inline-flex flex-column">
                        <input type="hidden" name="_csrf" value="{{ csrf() }}">
                        <button type="submit" class="btn btn-fill px-0 py-2" id="twitter">
                          <div class="eff"></div>
                          <span class="btn-label p-3"><i class="fa fa-twitter"></i></span>
                          <span class="btn-label-text p-3">{{ t('Sign in') }}</span>
                        </button>
                        <div class="small text-center">by Twitter Account</div>
                      </form>
                    </div>
                    {% endif %}
                    {% if getConfig('crowi', 'security:passport-oidc:isEnabled') %}
                    <div class="input-group justify-content-center d-flex mt-5">
                      <form role="form" action="/passport/oidc" class="d-inline-flex flex-column">
                        <input type="hidden" name="_csrf" value="{{ csrf() }}">
                        <button type="submit" class="btn btn-fill px-0 py-2" id="oidc">
                          <div class="eff"></div>
                          <span class="btn-label p-3"><i class="fa fa-openid"></i></span>
                          <span class="btn-label-text p-3">{{ t('Sign in') }}</span>
                        </button>
                        <div class="small text-center">{{ getConfig('crowi', 'security:passport-oidc:providerName') || "OpenID Connect" }}</div>
                      </form>
                    </div>
                    {% endif %}
                    {% if getConfig('crowi', 'security:passport-saml:isEnabled') %}
                    <div class="input-group justify-content-center d-flex mt-5">
                      <form role="form" action="/passport/saml" class="d-inline-flex flex-column">
                        <input type="hidden" name="_csrf" value="{{ csrf() }}">
                        <button type="submit" class="btn btn-fill px-0 py-2" id="saml">
                          <div class="eff"></div>
                          <span class="btn-label p-3"><i class="fa fa-key"></i></span>
                          <span class="btn-label-text p-3">{{ t('Sign in') }}</span>
                        </button>
                        <div class="small text-center">with SAML</div>
                      </form>
                    </div>
                    {% endif %}
                    {% if getConfig('crowi', 'security:passport-basic:isEnabled') %}
                    <div class="input-group justify-content-center d-flex mt-5">
                      <form role="form" action="/passport/basic" class="d-inline-flex flex-column">
                        <input type="hidden" name="_csrf" value="{{ csrf() }}">
                        <button type="submit" class="btn btn-fill px-0 py-2" id="basic">
                          <div class="eff"></div>
                          <span class="btn-label p-3"><i class="fa fa-lock"></i></span>
                          <span class="btn-label-text p-3">{{ t('Sign in') }}</span>
                        </button>
                        <div class="small text-center">with Basic Auth</div>
                      </form>
                    </div>
                  {% endif %}
                  </div>{# ./d-flex flex-row flex-wrap #}
                  <div class="spacer"></div>
                </div>
                <div class="border-bottom"></div>
                <div class="text-center">
                  <button class="collapse-anchor btn btn-xs btn-collapse-external-auth mb-3"
                      data-toggle="{% if isExternalAuthCollapsible %}collapse{% endif %}" data-target="#external-auth" aria-expanded="false" aria-controls="external-auth">
                    External Auth
                  </button>
                </div>
                {% else %}
                <div class="border-bottom mb-3"></div>
                {% endif %}

                {% if isExternalAuthCollapsible %}
                <script>
                  const isMobile = /iphone|ipad|android/.test(window.navigator.userAgent.toLowerCase());

                  if (!isMobile) {
                    $(".collapse-anchor").hover(
                      function() {
                        $('.collapse-external-auth').collapse('show');
                      },
                      function() {
                        $('.collapse-external-auth').collapse('hide');
                      }
                    );
                  }
                </script>
                {% endif %}

                <div class="row">
                  <div class="col-12 text-right py-2">
                    {% if isRegistrationEnabled %}
                    <a href="#register" id="register" class="link-switch">
                      <i class="ti-check-box"></i> {{ t('Sign up is here') }}
                    </a>
                    {% else %}
                    &nbsp;
                    {% endif %}
                  </div>
                </div>

              </div>

              {% if isRegistrationEnabled %}
              <div class="back">
                {% if getConfig('crowi', 'security:registrationMode') == 'Restricted' %}
                <p class="alert alert-warning">
                  {{ t('page_register.notice.restricted') }}<br>
                  {{ t('page_register.notice.restricted_defail') }}
                </p>
                {% endif %}

                <form role="form" action="/register" method="post" id="register-form">
                  <div class="input-group" id="input-group-username">
                    <div class="input-group-prepend">
                      <span class="input-group-text"><i class="icon-user"></i></span>
                    </div>
                    <input type="text" class="form-control" placeholder="{{ t('User ID') }}" name="registerForm[username]" value="{{ req.body.registerForm.username }}" required>
                  </div>
                  <p class="form-text text-danger">
                    <span id="help-block-username"></span>
                  </p>

                  <div class="input-group">
                    <div class="input-group-prepend">
                      <span class="input-group-text"><i class="icon-tag"></i></span>
                    </div>
                    <input type="text" class="form-control" placeholder="{{ t('Name') }}" name="registerForm[name]" value="{{ req.body.registerForm.name }}" required>
                  </div>

                  <div class="input-group">
                    <div class="input-group-prepend">
                      <span class="input-group-text"><i class="icon-envelope"></i></span>
                    </div>
                    <input type="email" class="form-control" placeholder="{{ t('Email') }}" name="registerForm[email]" value="{{ req.body.registerForm.email }}" required>
                  </div>
                  {% if getConfig('crowi', 'security:registrationWhiteList') && getConfig('crowi', 'security:registrationWhiteList').length %}
                  <p class="form-text">
                    {{ t('page_register.form_help.email') }}
                  </p>
                  <ul>
                    {% for em in getConfig('crowi', 'security:registrationWhiteList') %}
                    <li><code>{{ em }}</code></li>
                    {% endfor %}
                  </ul>
                  {% endif %}

                  <div class="input-group">
                    <div class="input-group-prepend">
                      <span class="input-group-text"><i class="icon-lock"></i></span>
                    </div>
                    <input type="password" class="form-control" placeholder="{{ t('Password') }}" name="registerForm[password]" required>
                  </div>

                  <div class="input-group justify-content-center mt-5">
                    <input type="hidden" name="_csrf" value="{{ csrf() }}">
                    <button type="submit" class="btn btn-fill px-0 py-2" id="register">
                      <div class="eff"></div>
                      <span class="btn-label p-3"><i class="icon-user-follow"></i></span>
                      <span class="btn-label-text p-3">{{ t('Sign up') }}</span>
                    </button>
                  </div>

                </form>

                <div class="border-bottom mb-3"></div>

                <div class="row">
                  <div class="text-right col-12 py-1">
                    <a href="#login" id="login" class="link-switch">
                      <i class="icon-fw icon-login"></i>{{ t('Sign in is here') }}
                    </a>
                  </div>
                </div>
              </div>

              {% endif %} {# if isRegistrationEnabled id false #}
            </div>

            <a href="https://growi.org" class="link-growi-org pl-3">
              <span class="growi">GROWI</span>.<span class="org">ORG
            </a>

          </div>
        </div>
      </div>
    </div>
  </div>   */}
</div>
    );
  }

}

/**
 * Wrapper component for using unstated
 */
const LoginFormWrapper = (props) => {
  return createSubscribedElement(LoginForm, props, [AppContainer]);
};

LoginForm.propTypes = {
  t: PropTypes.func.isRequired, // i18next
  appContainer: PropTypes.instanceOf(AppContainer).isRequired,

  keyword: PropTypes.string,
  onSubmit: PropTypes.func.isRequired,
  onInputChange: PropTypes.func,
};

LoginForm.defaultProps = {
  onInputChange: () => { },
};

export default LoginFormWrapper;
