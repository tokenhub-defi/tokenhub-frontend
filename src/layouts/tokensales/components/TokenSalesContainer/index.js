/* eslint-disable default-case */
import { Grid } from "@mui/material";
import TokenNavbar from "components/App/TokenNavbar";
import SuiBox from "components/SuiBox";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import humanizeDuration from "humanize-duration";
import { TokenSalesContext } from "layouts/tokensales/context/TokenSalesContext";
import { observer } from "mobx-react";
import moment from "moment";
import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PeriodCard from "../PeriodCard/PeriodCard";
import SalesRules from "../SalesRules";
import TokenInfo from "../TokenInfo";
import TokenSalesForm from "../TokenSalesForm";

const TokenSalesContainer = () => {
  const { tokenSalesStore, salesContractStore } = useContext(TokenSalesContext);
  const { tokenContract, tokenStore, tokenState } = tokenSalesStore;
  const [reference, setReference] = useState({});
  const [startCountdown, setStartCountdown] = useState();
  const [saleCountDown, setSaleCountdown] = useState();
  const [graceCountdown, setGraceCountdown] = useState();

  const { saleId } = useParams();

  const getCampaign = async () => {
    let camp = null;
    try {
      camp = await salesContractStore.getCampaign(parseInt(saleId, 10));
      if (camp) {
        await tokenSalesStore.fetchContractStatus(camp.sale_contract);
        if (camp.reference) {
          const ref = await fetch(camp.reference);
          const refJson = await ref.json();
          setReference(refJson);
        }
      }
    } catch (error) {
      console.error("Token Sale Init Contract: ", error);
    }
    return camp;
  };

  const init = async (contractId) => {
    try {
      await salesContractStore.initSalesContract();
      await tokenSalesStore.initContract(contractId);
    } catch (error) {
      console.error("Token Sale Init Contract: ", error);
    }
  };

  useEffect(async () => {
    let campaign = null;

    if (saleId) {
      campaign = await getCampaign();
      tokenSalesStore.setAccountId(campaign.sale_contract);
    }
    if (tokenStore.accountId && campaign) {
      init(campaign.sale_contract);
    }
  }, [tokenStore.accountId]);

  useEffect(() => {
    if (tokenContract?.tokenPeriod) {
      console.log("token contract", tokenContract);
      switch (tokenContract.tokenPeriod) {
        case "NOT_STARTED":
          {
            let startInterval = tokenSalesStore.getCountdownStart(tokenContract);
            if (window.startInterval) clearInterval(window.startInterval);
            window.startInterval = setInterval(async () => {
              startInterval -= 1;
              if (startInterval <= 0) {
                clearInterval(window.startInterval);
                setStartCountdown(null);
                await tokenSalesStore.fetchContractStatus(tokenState.contract.contractId);
              }
            }, 1000);
            setStartCountdown(tokenSalesStore.getStartTime());
          }
          break;
        case "ON_SALE":
          {
            let salesInterval = tokenSalesStore.getCountdownGrace(tokenContract);
            if (window.salesInterval) clearInterval(window.salesInterval);
            window.salesInterval = setInterval(async () => {
              salesInterval -= 1;
              if (salesInterval <= 0) {
                clearInterval(window.salesInterval);
                setSaleCountdown(null);
                await tokenSalesStore.fetchContractStatus(tokenState.contract.contractId);
              }
            }, 1000);
            setSaleCountdown(tokenSalesStore.getSalesEndTime());
          }
          break;
        case "ON_GRACE":
          {
            let graceInterval = tokenSalesStore.getCountdownRedeem(tokenContract);
            if (window.graceInterval) clearInterval(window.graceInterval);
            window.graceInterval = setInterval(async () => {
              graceInterval -= 1;
              if (graceInterval <= 0) {
                clearInterval(window.graceInterval);
                setGraceCountdown(null);
                await tokenSalesStore.fetchContractStatus(tokenState.contract.contractId);
              }
            }, 1000);
            setGraceCountdown(tokenSalesStore.getRedeemEndTime());
          }
          break;
      }
    }
  }, [tokenContract]);

  return (
    <DashboardLayout>
      <TokenNavbar />
      <SuiBox py={3}>
        <SuiBox mb={3}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={4} xl={4}>
              <PeriodCard
                title={{ text: "start time" }}
                period={
                  new Date(tokenContract?.saleInfo?.start_time / 1000000).toLocaleDateString() || ""
                }
                icon={{ color: "warning", component: "access_time" }}
                countDown={startCountdown}
              />
            </Grid>
            <Grid item xs={12} sm={4} xl={4}>
              <PeriodCard
                title={{ text: "sales period" }}
                period={
                  humanizeDuration(
                    moment.duration(tokenContract?.saleInfo?.sale_duration / 1000000),
                    { spacer: " ", delimiter: " " }
                  )
                  // moment.duration(tokenContract?.saleInfo?.sale_duration / 1000000).humanize() || ""
                }
                icon={{ color: "info", component: "access_time" }}
                countDown={saleCountDown}
              />
            </Grid>
            <Grid item xs={12} sm={4} xl={4}>
              <PeriodCard
                title={{ text: "grace period" }}
                period={
                  humanizeDuration(
                    moment.duration(tokenContract?.saleInfo?.grace_duration / 1000000),
                    { spacer: " ", delimiter: " " }
                  )
                  // moment.duration(tokenContract?.saleInfo?.grace_duration / 1000000).humanize() ||
                  // ""
                }
                icon={{ color: "primary", component: "access_time" }}
                countDown={graceCountdown}
              />
            </Grid>
          </Grid>
        </SuiBox>
        <SuiBox mb={3}>
          <Grid container spacing={3}>
            <Grid item xs={12} lg={6}>
              <TokenSalesForm />
            </Grid>
            <Grid item xs={12} lg={6}>
              <TokenInfo reference={reference} />
              <SalesRules />
            </Grid>
          </Grid>
        </SuiBox>
      </SuiBox>
    </DashboardLayout>
  );
};

export default observer(TokenSalesContainer);
