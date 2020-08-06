import React, { Suspense } from 'react';
import { withTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import loggerFactory from '@alias/logger';

import { withUnstatedContainers } from '../UnstatedUtils';

import AdminImportContainer from '../../services/AdminImportContainer';
import { toastError } from '../../util/apiNotification';

import ImportDataPageContents from './ImportData/ImportDataPageContents';

const logger = loggerFactory('growi:importer');

function ImportDataPage(props) {
  return (
    <Suspense
      fallback={(
        <div className="row">
          <i className="fa fa-5x fa-spinner fa-pulse mx-auto text-muted"></i>
        </div>
      )}
    >
      <RenderImportDataPageWrapper />
    </Suspense>
  );
}

function RenderImportDataPage(props) {
  if (props.adminImportContainer.state.title === props.adminImportContainer.dummyTitle) {
    throw new Promise(async() => {
      try {
        await props.adminImportContainer.retrieveImportSettingsData();
      }
      catch (err) {
        toastError(err);
        props.adminImportContainer.setState({ retrieveError: err.message });
        logger.error(err);
      }
    });
  }

  return <ImportDataPageContents />;

}

RenderImportDataPage.propTypes = {
  t: PropTypes.func.isRequired, // i18next
  adminImportContainer: PropTypes.instanceOf(AdminImportContainer).isRequired,
};


/**
 * Wrapper component for using unstated
 */
const RenderImportDataPageWrapper = withUnstatedContainers(RenderImportDataPage, [AdminImportContainer]);

export default withTranslation()(ImportDataPage);
