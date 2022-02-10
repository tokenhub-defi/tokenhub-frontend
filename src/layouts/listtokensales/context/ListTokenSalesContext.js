/* eslint-disable import/named */
/* eslint-disable react/prop-types */
import { useSoftUIController } from "context";
import React, { createContext } from "react";
import { ListTokenStore } from "../stores/ListTokenSalesStore";

const ListTokenSalesContext = createContext();
const listTokenSalesStore = new ListTokenStore();
const ListTokenSalesProvider = (props) => {
  const [controller] = useSoftUIController();
  const { tokenStore } = controller;
  const { children } = props;
  listTokenSalesStore.setTokenStore(tokenStore);

  return (
    <ListTokenSalesContext.Provider
      value={{
        listTokenSalesStore,
      }}
    >
      {children}
    </ListTokenSalesContext.Provider>
  );
};

export { ListTokenSalesContext, ListTokenSalesProvider };
