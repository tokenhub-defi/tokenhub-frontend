// import { getTokenFactoryConfig } from "layouts/tokensales/config";
// import { getConfig } from "layouts/tokensales/config";
import { action, makeObservable } from "mobx";
// import { connect, keyStores, utils, WalletConnection } from "near-api-js";

// eslint-disable-next-line import/prefer-default-export
export class ListTokenStore {
  constructor() {
    makeObservable(this, {
      setTokenStore: action,
    });
  }
  
  setTokenStore = (tokenStore) => {
    this.tokenStore = tokenStore;
  };
}
