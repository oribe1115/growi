import type { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import dynamic from 'next/dynamic';
import Head from 'next/head';

import SearchResultLayout from '~/components/Layout/SearchResultLayout';
import { DrawioViewerScript } from '~/components/Script/DrawioViewerScript';
import type { CrowiRequest } from '~/interfaces/crowi-request';
import type { RendererConfig } from '~/interfaces/services/renderer';
import type { ISidebarConfig } from '~/interfaces/sidebar-config';
import type { IUser, IUserHasId } from '~/interfaces/user';
import type { IUserUISettings } from '~/interfaces/user-ui-settings';
import type { UserUISettingsModel } from '~/server/models/user-ui-settings';
import {
  useCsrfToken, useCurrentUser, useDrawioUri, useIsContainerFluid, useIsSearchPage, useIsSearchScopeChildrenAsDefault,
  useIsSearchServiceConfigured, useIsSearchServiceReachable, useRendererConfig, useShowPageLimitationL,
} from '~/stores/context';
import {
  usePreferDrawerModeByUser, usePreferDrawerModeOnEditByUser, useSidebarCollapsed,
  useCurrentSidebarContents, useCurrentProductNavWidth,
} from '~/stores/ui';

import { SearchPage } from '../components/SearchPage';

import type { NextPageWithLayout } from './_app.page';
import {
  getNextI18NextConfig, getServerSideCommonProps, generateCustomTitle, CommonProps, useInitSidebarConfig,
} from './utils/commons';


type Props = CommonProps & {
  currentUser: IUser,

  isSearchServiceConfigured: boolean,
  isSearchServiceReachable: boolean,
  isSearchScopeChildrenAsDefault: boolean,

  drawioUri: string | null,

  // UI
  userUISettings?: IUserUISettings
  // Sidebar
  sidebarConfig: ISidebarConfig,

  // Render config
  rendererConfig: RendererConfig,

  // search limit
  showPageLimitationL: number

  isContainerFluid: boolean,

};

const SearchResultPage: NextPageWithLayout<Props> = (props: Props) => {
  const { userUISettings } = props;

  const { t } = useTranslation();

  // commons
  useCsrfToken(props.csrfToken);

  useCurrentUser(props.currentUser ?? null);

  // Search
  useIsSearchPage(true);
  useIsSearchServiceConfigured(props.isSearchServiceConfigured);
  useIsSearchServiceReachable(props.isSearchServiceReachable);
  useIsSearchScopeChildrenAsDefault(props.isSearchScopeChildrenAsDefault);

  useDrawioUri(props.drawioUri);

  // init sidebar config with UserUISettings and sidebarConfig
  useInitSidebarConfig(props.sidebarConfig, props.userUISettings);

  // render config
  useRendererConfig(props.rendererConfig);

  useShowPageLimitationL(props.showPageLimitationL);
  useIsContainerFluid(props.isContainerFluid);

  const PutbackPageModal = (): JSX.Element => {
    const PutbackPageModal = dynamic(() => import('../components/PutbackPageModal'), { ssr: false });
    return <PutbackPageModal />;
  };

  const title = generateCustomTitle(props, t('search_result.title'));

  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>

      <div id="search-page" className="dynamic-layout-root">
        <SearchPage />
      </div>

      <PutbackPageModal />
    </>
  );
};

SearchResultPage.getLayout = function getLayout(page) {
  return (
    <>
      <DrawioViewerScript />
      <SearchResultLayout>{page}</SearchResultLayout>
    </>
  );
};

async function injectUserUISettings(context: GetServerSidePropsContext, props: Props): Promise<void> {
  const { model: mongooseModel } = await import('mongoose');

  const req = context.req as CrowiRequest<IUserHasId & any>;
  const { user } = req;

  const UserUISettings = mongooseModel('UserUISettings') as UserUISettingsModel;
  const userUISettings = user == null ? null : await UserUISettings.findOne({ user: user._id }).exec();
  if (userUISettings != null) {
    props.userUISettings = userUISettings.toObject();
  }
}

function injectServerConfigurations(context: GetServerSidePropsContext, props: Props): void {
  const req: CrowiRequest = context.req as CrowiRequest;
  const { crowi } = req;
  const { configManager, searchService } = crowi;

  props.isSearchServiceConfigured = searchService.isConfigured;
  props.isSearchServiceReachable = searchService.isReachable;
  props.isSearchScopeChildrenAsDefault = configManager.getConfig('crowi', 'customize:isSearchScopeChildrenAsDefault');
  props.isContainerFluid = configManager.getConfig('crowi', 'customize:isContainerFluid');

  props.drawioUri = configManager.getConfig('crowi', 'app:drawioUri');

  props.sidebarConfig = {
    isSidebarDrawerMode: configManager.getConfig('crowi', 'customize:isSidebarDrawerMode'),
    isSidebarClosedAtDockMode: configManager.getConfig('crowi', 'customize:isSidebarClosedAtDockMode'),
  };

  props.rendererConfig = {
    isEnabledLinebreaks: configManager.getConfig('markdown', 'markdown:isEnabledLinebreaks'),
    isEnabledLinebreaksInComments: configManager.getConfig('markdown', 'markdown:isEnabledLinebreaksInComments'),
    adminPreferredIndentSize: configManager.getConfig('markdown', 'markdown:adminPreferredIndentSize'),
    isIndentSizeForced: configManager.getConfig('markdown', 'markdown:isIndentSizeForced'),

    plantumlUri: process.env.PLANTUML_URI ?? null,
    blockdiagUri: process.env.BLOCKDIAG_URI ?? null,

    // XSS Options
    isEnabledXssPrevention: configManager.getConfig('markdown', 'markdown:rehypeSanitize:isEnabledPrevention'),
    xssOption: configManager.getConfig('markdown', 'markdown:rehypeSanitize:option'),
    attrWhiteList: JSON.parse(crowi.configManager.getConfig('markdown', 'markdown:rehypeSanitize:attributes')),
    tagWhiteList: crowi.configManager.getConfig('markdown', 'markdown:rehypeSanitize:tagNames'),
    highlightJsStyleBorder: crowi.configManager.getConfig('crowi', 'customize:highlightJsStyleBorder'),
  };

  props.showPageLimitationL = configManager.getConfig('crowi', 'customize:showPageLimitationL');
}

/**
 * for Server Side Translations
 * @param context
 * @param props
 * @param namespacesRequired
 */
async function injectNextI18NextConfigurations(context: GetServerSidePropsContext, props: Props, namespacesRequired?: string[] | undefined): Promise<void> {
  const nextI18NextConfig = await getNextI18NextConfig(serverSideTranslations, context, namespacesRequired);
  props._nextI18Next = nextI18NextConfig._nextI18Next;
}

export const getServerSideProps: GetServerSideProps = async(context: GetServerSidePropsContext) => {
  const req = context.req as CrowiRequest<IUserHasId & any>;
  const { user } = req;

  const result = await getServerSideCommonProps(context);

  // check for presence
  // see: https://github.com/vercel/next.js/issues/19271#issuecomment-730006862
  if (!('props' in result)) {
    throw new Error('invalid getSSP result');
  }

  const props: Props = result.props as Props;

  if (user != null) {
    props.currentUser = user.toObject();
  }

  await injectUserUISettings(context, props);
  injectServerConfigurations(context, props);
  await injectNextI18NextConfigurations(context, props, ['translation']);

  return {
    props,
  };
};

export default SearchResultPage;
