/* eslint-disable import/named */
/* eslint-disable react/prop-types */
import { useSoftUIController } from "context";
import React, { createContext } from "react";
import { SalesContractStore } from "../stores/SalesContractStore";
import { ListTokenStore } from "../stores/ListTokenSalesStore";
import { TokenSalesStore } from "../../tokensales/stores/TokenSales.store";

const ListTokenSalesContext = createContext();

const listTokenSalesStore = new ListTokenStore();
const tokenSalesStore = new TokenSalesStore();
const salesContractStore = new SalesContractStore();

const ListTokenSalesProvider = (props) => {
  const [controller] = useSoftUIController();
  const { tokenStore } = controller;
  const { children } = props;
  tokenSalesStore.setTokenStore(tokenStore);
  listTokenSalesStore.setTokenStore(tokenStore);
  salesContractStore.setTokenStore(tokenStore);
  salesContractStore.setTokenSalesStore(tokenSalesStore);

  return (
    <ListTokenSalesContext.Provider
      value={{
        tokenStore,
        tokenSalesStore,
        listTokenSalesStore,
        salesContractStore,
      }}
    >
      {children}
    </ListTokenSalesContext.Provider>
  );
};

export { ListTokenSalesContext, ListTokenSalesProvider };
