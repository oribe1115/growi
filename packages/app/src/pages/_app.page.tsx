import React, { ReactElement, ReactNode, useEffect } from 'react';

import { NextPage } from 'next';
import { appWithTranslation } from 'next-i18next';
import { AppProps } from 'next/app';
import { SWRConfig } from 'swr';

import * as nextI18nConfig from '^/config/next-i18next.config';

import { ActivatePluginService } from '~/client/services/activate-plugin';
import { useI18nextHMR } from '~/services/i18next-hmr';
import {
  useAppTitle, useConfidential, useGrowiVersion, useSiteUrl, useIsDefaultLogo, useForcedColorScheme,
} from '~/stores/context';
import {
  useCurrentProductNavWidth, useCurrentSidebarContents, usePreferDrawerModeByUser, usePreferDrawerModeOnEditByUser, useSidebarCollapsed,
} from '~/stores/ui';
import { swrGlobalConfiguration } from '~/utils/swr-utils';

import { CommonProps } from './utils/commons';
import { registerTransformerForObjectId } from './utils/objectid-transformer';

import '~/styles/style-app.scss';
import '~/styles/theme/_apply-colors-light.scss';
import '~/styles/theme/_apply-colors-dark.scss';
import '~/styles/theme/_apply-colors.scss';

const isDev = process.env.NODE_ENV === 'development';


// eslint-disable-next-line @typescript-eslint/ban-types
export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode,
}

type GrowiAppProps = AppProps & {
  Component: NextPageWithLayout,
};

// register custom serializer
registerTransformerForObjectId();

function GrowiApp({ Component, pageProps }: GrowiAppProps): JSX.Element {
  useI18nextHMR(isDev);

  useEffect(() => {
    import('bootstrap/dist/js/bootstrap');
  }, []);

  useEffect(() => {
    ActivatePluginService.activateAll();
  }, []);


  const commonPageProps = pageProps as CommonProps;
  useAppTitle(commonPageProps.appTitle);
  useSiteUrl(commonPageProps.siteUrl);
  useConfidential(commonPageProps.confidential);
  useGrowiVersion(commonPageProps.growiVersion);
  useIsDefaultLogo(commonPageProps.isDefaultLogo);
  useForcedColorScheme(commonPageProps.forcedColorScheme);

  // init sidebar config with UserUISettings and sidebarConfig
  const { sidebarConfig, userUISettings } = commonPageProps;
  usePreferDrawerModeByUser(userUISettings?.preferDrawerModeByUser ?? sidebarConfig.isSidebarDrawerMode);
  usePreferDrawerModeOnEditByUser(userUISettings?.preferDrawerModeOnEditByUser);
  useSidebarCollapsed(userUISettings?.isSidebarCollapsed ?? sidebarConfig.isSidebarClosedAtDockMode);
  useCurrentSidebarContents(userUISettings?.currentSidebarContents);
  useCurrentProductNavWidth(userUISettings?.currentProductNavWidth);

  // Use the layout defined at the page level, if available
  const getLayout = Component.getLayout ?? (page => page);

  return (
    <SWRConfig value={swrGlobalConfiguration}>
      {getLayout(<Component {...pageProps} />)}
    </SWRConfig>
  );
}

// export default appWithTranslation(GrowiApp);

export default appWithTranslation(GrowiApp, nextI18nConfig);
