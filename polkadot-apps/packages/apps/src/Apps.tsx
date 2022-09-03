// Copyright 2017-2022 @polkadot/apps authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { BareProps as Props, ThemeDef } from '@polkadot/react-components/types';
import { keyring } from '@polkadot/ui-keyring';

import React, { useContext, useEffect, useMemo, useState } from 'react';
import styled, { ThemeContext } from 'styled-components';

import AccountSidebar from '@polkadot/app-accounts/Sidebar';
import { getSystemColor } from '@polkadot/apps-config';
import GlobalStyle from '@polkadot/react-components/styles';
import { useApi } from '@polkadot/react-hooks';
import Signer from '@polkadot/react-signer';

import * as snap from "snap-adapter";

import ConnectingOverlay from './overlays/Connecting';
import Content from './Content';
import Menu from './Menu';
import WarmUp from './WarmUp';

export const PORTAL_ID = 'portals';

function Apps({ className = '' }: Props): React.ReactElement<Props> {
  const { theme } = useContext(ThemeContext as React.Context<ThemeDef>);
  const { isDevelopment, specName, systemChain, systemName } = useApi();

  const [snapConnected, setSnapConnected] = useState(false);
  const [loading, setLoading] = useState(false);

  const uiHighlight = useMemo(
    () => isDevelopment
      ? undefined
      : getSystemColor(systemChain, systemName, specName),
    [isDevelopment, specName, systemChain, systemName]
  );

  useEffect(() => {
    const connectSnap = async () => {
      const isEnabled = await snap.isEnabled();
      setLoading(isEnabled);
      setSnapConnected(isEnabled);

      if (isEnabled) {
        let accounts = await snap.getAccounts();
        console.log({ accounts });

        if (accounts.length < 1) {
          const account = await snap.generateNewAccount();
          accounts = [account.address]
        }

        console.log({ accounts });
        for (const account of accounts) {
          keyring.addExternal(account);
        }
      }
    }
    connectSnap().catch(console.error);
  }, []);

  const doConnectSnap = async () => {
    setLoading(true);
    setSnapConnected(false);
    try {
      await snap.connect();
      setSnapConnected(true);

    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  return (
    <>
      <GlobalStyle uiHighlight={uiHighlight} />
      <div className={`apps--Wrapper theme--${theme} ${className}`}>
        {!snapConnected && (
          <>
            <h1>Connect and install snap</h1>
            <p>
              New Aleph Zero account will be automatically created from your Metamask private key.
            </p>
            <p>
              Please take a not of snap permission, that you will be asked for.
            </p>
            <p>
              Note: We recommend using a throw-away Metamask account.
            </p>
            <p>
              This demo uses Metamask flask (canary release). In order to use it, please follow installation instructions in readme: https://github.com/piotr-roslaniec/ethwarsaw-2022#TODO.
            </p>
            {loading && <p>Loading...</p>}
            {!loading &&
              <button
                disabled={snapConnected}
                onClick={doConnectSnap}
              >
                Connect
              </button>}
          </>
        )}
        {snapConnected && (
          <>                  <Menu />
            <AccountSidebar>
              <Signer>
                <Content />
              </Signer>
              <ConnectingOverlay />
              <div id={PORTAL_ID} />
            </AccountSidebar>
          </>

        )}
      </div>
      <WarmUp />
    </>
  );
}

export default React.memo(styled(Apps)`
  background: var(--bg-page);
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  min-height: 100vh;

  .--hidden {
    display: none;
  }
`);
