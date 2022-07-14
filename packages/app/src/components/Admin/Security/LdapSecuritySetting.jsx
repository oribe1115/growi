import React from 'react';

import PropTypes from 'prop-types';

import AdminLdapSecurityContainer from '~/client/services/AdminLdapSecurityContainer';
import { toastError } from '~/client/util/apiNotification';
import { toArrayIfNot } from '~/utils/array-utils';

import { withUnstatedContainers } from '../../UnstatedUtils';

import LdapSecuritySettingContents from './LdapSecuritySettingContents';

let retrieveErrors = null;
function LdapSecuritySetting(props) {
  const { adminLdapSecurityContainer } = props;
  if (adminLdapSecurityContainer.state.serverUrl === adminLdapSecurityContainer.dummyServerUrl) {
    throw (async() => {
      try {
        await adminLdapSecurityContainer.retrieveSecurityData();
      }
      catch (err) {
        const errs = toArrayIfNot(err);
        toastError(errs);
        retrieveErrors = errs;
        adminLdapSecurityContainer.setState({ serverUrl: adminLdapSecurityContainer.dummyServerUrlForError });
      }
    })();
  }

  if (adminLdapSecurityContainer.state.serverUrl === adminLdapSecurityContainer.dummyServerUrlForError) {
    throw new Error(`${retrieveErrors.length} errors occured`);
  }

  return <LdapSecuritySettingContents />;
}

LdapSecuritySetting.propTypes = {
  adminLdapSecurityContainer: PropTypes.instanceOf(AdminLdapSecurityContainer).isRequired,
};

const LdapSecuritySettingWithUnstatedContainer = withUnstatedContainers(LdapSecuritySetting, [
  AdminLdapSecurityContainer,
]);

export default LdapSecuritySettingWithUnstatedContainer;
