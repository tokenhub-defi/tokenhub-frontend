import { action, makeObservable, observable } from "mobx";
import { Contract } from "near-api-js";

// eslint-disable-next-line import/prefer-default-export
export class SalesContractStore {
  ACCOUNT_ID = "sales.tokenhub.testnet";

  tokenStore;

  tokenSalesStore;

  DEFAULT_GAS = 300000000000000;

  salesContract = null;

  constructor() {
    makeObservable(this, {
      salesContract: observable,

      setTokenStore: action,
      setTokenSalesStore: action,

      getCampaigns: action,
      getCampaign: action,
      addCampaign: action,
      removeCampaign: action,
    });
  }

  setTokenStore = (tokenStore) => {
    this.tokenStore = tokenStore;
  };

  setTokenSalesStore = (tokenSalesStore) => {
    this.tokenSalesStore = tokenSalesStore;
  };

  initSalesContract = async () => {
    try {
      const contract = await new Contract(
        this.tokenStore.walletConnection.account(),
        this.ACCOUNT_ID,
        {
          viewMethods: ["get_campaign", "get_campaign_list"],
          // Change methods can modify the state. But you don't receive the returned value when called.
          changeMethods: ["add_campaign", "remove_campaign"],
        }
      );
      this.salesContract = contract;
    } catch (error) {
      console.log("initSalesContract", error);
    }
  };

  getCampaigns = async (fromIndex, limit) => {
    try {
      const res = await this.tokenStore.callViewMethod(this.ACCOUNT_ID, "get_campaign_list", {
        from_index: fromIndex,
        limit,
      });
      // Fetch token info
      const promiseFetchTokenInfos = res.result.map((item) =>
        this.tokenSalesStore.fetchContractStatus(item[1].sale_contract)
      );
      const metaData = await Promise.all(promiseFetchTokenInfos);
      // Fetch reference info
      const promiseReference = [];
      const referenceIds = [];
      res.result.forEach((item) => {
        if (item[1].reference) {
          referenceIds.push(item[0]);
          promiseReference.push(fetch(item[1].reference));
        }
      });
      const refResponses = await Promise.all(promiseReference);
      const refData = await Promise.all(refResponses.map((response) => response.json()));
      console.log(refData);
      // Map data
      res.result = res.result.map((item, index) => {
        const data = item;
        data[1] = { ...data[1], ...metaData[index] };
        const refIdIndex = referenceIds.findIndex((ri) => ri === data[0]);
        if (refIdIndex > -1) {
          data[1] = { ...data[1], ...{ refData: refData[refIdIndex] } };
        }
        return data;
      });
      return res;
    } catch (error) {
      console.error("get_campaign_list", error.message);
    }
    return null;
  };

  getCampaign = async (campId) => {
    try {
      // const campaign = await this.salesContract.get_campaign({ id: campId });
      const campaign = await this.tokenStore.callViewMethod(this.ACCOUNT_ID, "get_campaign", {
        id: campId,
      });
      console.log("get_campaign", campaign);
      return campaign;
    } catch (error) {
      console.error("get_campaign", error);
    }
    return null;
  };

  addCampaign = async (campaign) => {
    try {
      await this.salesContract.add_campaign({ campaign }, this.DEFAULT_GAS, "1");
    } catch (error) {
      console.error("add_campaign", error);
    }
  };

  removeCampaign = async (id) => {
    try {
      await this.salesContract.remove_campaign({ id }, this.DEFAULT_GAS, "1");
    } catch (error) {
      console.error("remove_campaign", error);
    }
  };
}
