/* eslint-disable camelcase */
/* eslint-disable arrow-body-style */
// import { light } from "@mui/material/styles/createPalette";
import TokenNavbar from "components/App/TokenNavbar";
import SuiBox from "components/SuiBox";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import { TokenFactoryContext } from "layouts/tokenfactory/context/TokenFactoryContext";
// import { TokenFactoryContext } from "layouts/tokenfactory/context/TokenFactoryContext";
import { observer } from "mobx-react";
import { useContext, useEffect, useReducer, useState } from "react";
// import { useContext } from "react";
// import { LOCAL_STORAGE_CURRENT_TOKEN } from "layouts/tokenfactory/constants/TokenFactory";
import SuiAlert from "components/SuiAlert";
import { Grid } from "@mui/material";
import moment from "moment";
import { TREASURY_ACCOUNT } from "layouts/tokenfactory/stores/TokenFactory.store";
import _ from "lodash";
import { useHistory, useLocation } from "react-router-dom";
import CreateToken from "../CreateToken";
import TokenFactoryStepper from "../TokenFactoryStepper";

// import { TokenFactoryContext } from "./context/TokenFactoryContext";

const TokenFactoryContainer = () => {
  const location = useLocation();
  const history = useHistory();
  const { tokenFactoryStore } = useContext(TokenFactoryContext);
  const { tokenStore } = tokenFactoryStore;
  const [newToken, setNewToken] = useReducer((state, newState) => ({ ...state, ...newState }), {
    icon: null,
    tokenName: "",
    symbol: "",
    initialSupply: 100000000,
    decimal: 8,
    allocationList: [],
  });

  const [alert, setAlert] = useReducer((state, newState) => ({ ...state, ...newState }), {
    open: false,
    message: "",
    color: "error",
  });

  const [isContinue, setIsContinue] = useState(false);

  const initNewToken = () => {
    const token = { ...newToken };
    // Add treasury allocation
    const treasury = {
      id: new Date().getTime() + 100000,
      accountId: TREASURY_ACCOUNT,
      allocatedPercent: "15",
      initialRelease: "8",
      vestingStartTime: new Date(),
      vestingEndTime: moment().add(30, "day"),
      vestingInterval: 1,
      vestingDuration: 4,
      isAccountExisted: true,
    };

    // Add creator allocation
    const creator = {
      id: new Date().getTime() + 200000,
      accountId: tokenStore.accountId,
      allocatedPercent: "85",
      initialRelease: "8",
      vestingStartTime: new Date(),
      vestingEndTime: moment().add(30, "day"),
      vestingInterval: 1,
      vestingDuration: 4,
      isAccountExisted: true,
    };

    token.allocationList = [creator, treasury];
    setNewToken(token);
  };
  useEffect(async () => {
    const lstAllTokens = await tokenFactoryStore.getListAllTokenContracts();
    tokenFactoryStore.setAllTokens(lstAllTokens);
  }, []);
  useEffect(async () => {
    if (!_.isEmpty(tokenStore.accountId)) {
      initNewToken();
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

  useEffect(() => {
    tokenFactoryStore.setToken(newToken);
  }, [newToken]);

  useEffect(async () => {
    const queryParams = new URLSearchParams(location.search);
    const resumeToken = queryParams.get("resume_token");
    const transactionHash = queryParams.get("transactionHashes");
    if (tokenFactoryStore.contract) {
      // let token = localStorage.getItem(LOCAL_STORAGE_CURRENT_TOKEN);
      let token;
      if (!_.isEmpty(resumeToken) || !_.isEmpty(transactionHash)) setIsContinue(true);
      if (!_.isEmpty(transactionHash)) {
        const result = await tokenFactoryStore.getTransactionStatus(transactionHash);
        if (result.status?.SuccessValue != null) {
          const action = result.transaction?.actions[0]?.FunctionCall;
          if (action.method_name === "register" && action.args) {
            token = JSON.parse(Buffer.from(action.args, "base64").toString("utf-8"));
            const allocationList = [];

            if (token.allocations) {
              Object.keys(token.allocations).forEach((k, index) => {
                let alItem = token.allocations[k];
                alItem = {
                  ...alItem,
                  ...{
                    id: new Date().getTime() + index,
                    accountId: k,
                    initialRelease: alItem.initial_release / 100,
                    allocatedPercent: alItem.allocated_percent / 100,
                    vestingStartTime: alItem.vesting_start_time / 10 ** 6,
                    vestingEndTime: alItem.vesting_end_time / 10 ** 6,
                    vestingInterval: alItem.vesting_interval / (24 * 3600 * 10 ** 9),
                    vestingDuration: Math.round(
                      (moment(alItem.vesting_end_time / 10 ** 6) -
                        moment(alItem.vesting_start_time / 10 ** 6)) /
                        (10 ** 3 * 24 * 3600)
                    ),
                  },
                };
                allocationList.push(alItem);
              });
            }
            token = {
              ...token,
              ...{
                tokenName: token.token_name,
                symbol: token.symbol,
                initialSupply: token.total_supply / 10 ** token.decimals,
                decimal: token.decimals,
                allocationList,
              },
            };
          }
        }
        setNewToken(token);
        console.log("TokenHash", token);
      }
      if (!_.isEmpty(resumeToken)) {
        token = tokenFactoryStore.registeredTokens.find((rt) => rt.symbol === resumeToken);
        setNewToken(token);
        console.log("TokenResume", token);
      }
    }
  }, [tokenFactoryStore.contract]);

  useEffect(async () => {
    if (!_.isEmpty(tokenFactoryStore.token.symbol) && isContinue) {
      const queryParams = new URLSearchParams(location.search);
      const { token } = tokenFactoryStore;
      try {
        const tokenState = await tokenFactoryStore.getTokenState(token);
        if (tokenState) {
          tokenFactoryStore.appendRegisteredToken({ ...tokenState, ...token });
          let {
            ft_contract_deployed,
            deployer_contract_deployed,
            ft_issued,
            allocation_initialized,
          } = tokenState;
          console.log("Token state", tokenState);

          if (ft_contract_deployed === 0) {
            setAlert({
              open: true,
              message: "Creating contract ...",
              color: "primary",
            });
            const res = await tokenFactoryStore.createContract();
            ft_contract_deployed = res != null ? 1 : 0;
          }
          if (deployer_contract_deployed === 0) {
            setAlert({
              open: true,
              message: "Creating deployer contract ...",
              color: "primary",
            });
            const res = await tokenFactoryStore.createDeployerContract();
            deployer_contract_deployed = res != null ? 1 : 0;
          }
          if (ft_issued === 0) {
            setAlert({
              open: true,
              message: "Issuing ...",
              color: "primary",
            });
            const res = await tokenFactoryStore.issue();
            ft_issued = res != null ? 1 : 0;
          }
          if (allocation_initialized === 0) {
            setAlert({
              open: true,
              message: "Initiating token allocation ...",
              color: "primary",
            });
            const res = await tokenFactoryStore.initTokenAllocation();
            if (res) {
              initNewToken();
              allocation_initialized = 1;
              queryParams.delete("resume_token");
              queryParams.delete("transactionHashes");
              history.replace({
                search: queryParams.toString(),
              });

              setAlert({
                open: true,
                message: "Create Token Success",
                color: "success",
              });
            }
          }
        }
      } catch (error) {
        if (error?.type !== "NotEnoughAllowance")
          setAlert({
            open: true,
            message: error.message,
            color: "error",
          });
        console.log(error);
        console.log(error.type);
      }
    }
  }, [tokenFactoryStore.token]);

  return (
    <DashboardLayout>
      <TokenNavbar />
      <SuiBox py={3}>
        <SuiBox mb={3}>
          <TokenFactoryStepper />
        </SuiBox>
        <SuiBox mb={3}>
          <CreateToken setAlert={setAlert} setToken={setNewToken} token={newToken} />
          {alert.open && (
            <Grid container justifyContent="center" alignItems="center">
              <Grid item xs={8}>
                <SuiBox mt={4} mb={1}>
                  <SuiAlert color={alert.color} dismissible>
                    {alert.message}
                  </SuiAlert>
                </SuiBox>
              </Grid>
            </Grid>
          )}
        </SuiBox>
      </SuiBox>
    </DashboardLayout>
  );
};
export default observer(TokenFactoryContainer);
