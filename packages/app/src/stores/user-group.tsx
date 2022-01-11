import useSWR, { SWRResponse } from 'swr';
import useSWRImmutable from 'swr/immutable';

import { apiv3Get } from '~/client/util/apiv3-client';
import { IUserGroupHasId, IUserGroupRelationHasId } from '~/interfaces/user';
import { UserGroupListResult, ChildUserGroupListResult, UserGroupRelationListResult } from '~/interfaces/user-group-response';
import { serializeKey } from './middlewares/serialize';


export const useSWRxUserGroupList = (initialData?: IUserGroupHasId[]): SWRResponse<UserGroupListResult, Error> => {
  return useSWRImmutable(
    '/user-groups',
    endpoint => apiv3Get(endpoint, { pagination: false }).then(result => result.data),
    {
      fallbackData: initialData,
    },
  );
};

export const useSWRxChildUserGroupList = (parentIds?: string[], initialData?: IUserGroupHasId[]): SWRResponse<ChildUserGroupListResult, Error> => {
  return useSWRImmutable(
    parentIds != null ? ['/user-groups/children', parentIds] : null,
    (endpoint, parentIds) => apiv3Get(endpoint, { parentIds }).then(result => result.data),
    {
      fallbackData: initialData,
      use: [serializeKey],
    },
  );
};

export const useSWRxUserGroupRelationList = (groupIds?: string[], initialData?: IUserGroupRelationHasId[]): SWRResponse<UserGroupRelationListResult, Error> => {
  return useSWRImmutable(
    groupIds != null ? ['/user-group-relations', groupIds] : null,
    (endpoint, parentIds) => apiv3Get(endpoint, { parentIds }).then(result => result.data),
    {
      fallbackData: initialData,
      use: [serializeKey],
    },
  );
};
