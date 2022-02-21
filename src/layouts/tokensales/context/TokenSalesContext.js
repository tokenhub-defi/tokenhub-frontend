/* eslint-disable import/named */
/* eslint-disable react/prop-types */
import { useSoftUIController } from "context";
import { SalesContractStore } from "layouts/listtokensales/stores/SalesContractStore";
import React, { createContext } from "react";
import { TokenSalesStore } from "../stores/TokenSales.store";

const TokenSalesContext = createContext();

const tokenSalesStore = new TokenSalesStore();
const salesContractStore = new SalesContractStore();

const TokenSalesProvider = (props) => {
  const [controller] = useSoftUIController();
  const { tokenStore } = controller;
  const { children } = props;

  tokenSalesStore.setTokenStore(tokenStore);
  salesContractStore.setTokenStore(tokenStore);
  salesContractStore.setTokenSalesStore(tokenSalesStore);

  return (
    <TokenSalesContext.Provider
      value={{
        tokenSalesStore,
        salesContractStore,
      }}
    >
      {children}
    </TokenSalesContext.Provider>
  );
};

export { TokenSalesContext, TokenSalesProvider };
