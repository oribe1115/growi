import React, { FC, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import loggerFactory from '~/utils/logger';

import { withUnstatedContainers } from '../../UnstatedUtils';
import { ConfirmModal } from './ConfirmModal';
import { toastSuccess, toastError } from '~/client/util/apiNotification';

import AdminAppContainer from '~/client/services/AdminAppContainer';

const logger = loggerFactory('growi:maintenanceMode');

type Props = {
  adminAppContainer: AdminAppContainer,
};

const MaintenanceMode: FC<Props> = (props: Props) => {
  const { t } = useTranslation();
  const { adminAppContainer } = props;

  const [isModalOpen, setModalOpen] = useState<boolean>(false);
  const [isMaintenanceMode, setMaintenanceMode] = useState<boolean | undefined>(adminAppContainer.state.isMaintenanceMode);

  const openModal = () => { setModalOpen(true) };
  const closeModal = () => { setModalOpen(false) };

  const onConfirmHandler = useCallback(async() => {
    closeModal();

    try {
      if (isMaintenanceMode) {
        await adminAppContainer.endMaintenanceMode();
        setMaintenanceMode(false);
      }
      else {
        await adminAppContainer.startMaintenanceMode();
        setMaintenanceMode(true);
      }
    }
    catch (err) {
      toastError(isMaintenanceMode ? t('maintenance_mode.failed_to_end_maintenance_mode') : t('maintenance_mode.failed_to_start_maintenance_mode'));
    }

    toastSuccess(isMaintenanceMode ? t('maintenance_mode.successfully_ended_maintenance_mode') : t('maintenance_mode.successfully_started_maintenance_mode'));
  }, [isMaintenanceMode, adminAppContainer, closeModal]);

  return (
    <>
      <ConfirmModal
        isModalOpen={isModalOpen}
        warningMessage={t('admin:maintenance_mode.warning_message')}
        supplymentaryMessage={t('admin:maintenance_mode.supplymentary_message')}
        confirmButtonTitle={isMaintenanceMode ? t('maintenance_mode.end_maintenance_mode') : t('maintenance_mode.start_maintenance_mode')}
        onConfirm={onConfirmHandler}
        onCancel={() => closeModal()}
      />
      <p className="card well">
        {t('admin:maintenance_mode.description')}
        <br />
        <br />
        <span className="text-warning">
          <i className="icon-exclamation icon-fw"></i>
          {t('admin:maintenance_mode.supplymentary_message')}
        </span>
      </p>
      <div className="row my-3">
        <div className="mx-auto">
          <button type="button" className="btn btn-success" onClick={() => openModal()}>
            {isMaintenanceMode ? t('maintenance_mode.end_maintenance_mode') : t('maintenance_mode.start_maintenance_mode')}
          </button>
        </div>
      </div>
    </>
  );
};

export default withUnstatedContainers(MaintenanceMode, [AdminAppContainer]);
