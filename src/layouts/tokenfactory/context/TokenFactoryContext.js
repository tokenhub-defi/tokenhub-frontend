/* eslint-disable import/named */
/* eslint-disable react/prop-types */
import { useSoftUIController } from "context";
import React, { createContext, useEffect } from "react";
import { TokenFactoryStore } from "../stores/TokenFactory.store";

const TokenFactoryContext = createContext();
const tokenFactoryStore = new TokenFactoryStore();
const TokenFactoryProvider = (props) => {
  const [controller] = useSoftUIController();
  const { tokenStore } = controller;
  const { children } = props;

  tokenFactoryStore.setTokenStore(tokenStore);
  useEffect(async () => {
    const lstAllTokens = await tokenFactoryStore.getListAllTokenContracts();
    tokenFactoryStore.setAllTokens(lstAllTokens);
  }, []);
  useEffect(async () => {
    if (tokenStore.accountId) {
      try {
        const lstMyToken = tokenFactoryStore.allTokens.filter(
          (t) => t.creator === tokenStore.accountId
        );
        const mergeLst = await tokenFactoryStore.getDeployerState(lstMyToken);
        tokenFactoryStore.setRegisteredTokens(mergeLst);
        if (!tokenFactoryStore.contract) await tokenFactoryStore.initContract();
      } catch (error) {
        console.log(error);
      }
    }
  }, [tokenStore.accountId]);
  return (
    <TokenFactoryContext.Provider
      value={{
        tokenFactoryStore,
      }}
    >
      {children}
    </TokenFactoryContext.Provider>
  );
};

export { TokenFactoryContext, TokenFactoryProvider };
