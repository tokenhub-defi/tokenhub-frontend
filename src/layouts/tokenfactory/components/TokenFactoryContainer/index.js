/* eslint-disable jsx-a11y/anchor-is-valid */
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
import moment from "moment";
import { TREASURY_ACCOUNT } from "layouts/tokenfactory/stores/TokenFactory.store";
import _ from "lodash";
import { useHistory, useLocation } from "react-router-dom";
import { Link, Typography } from "@mui/material";
import CreateToken from "../CreateToken";
import TokenFactoryStepper from "../TokenFactoryStepper";

// import { TokenFactoryContext } from "./context/TokenFactoryContext";

const TokenFactoryContainer = () => {
  const location = useLocation();
  const history = useHistory();
  const { tokenFactoryStore } = useContext(TokenFactoryContext);
  const { tokenStore } = tokenFactoryStore;
  const [isResume, setIsResume] = useState(false);
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

  const initNewToken = () => {
    const token = { ...newToken };
    // Add treasury allocation
    const treasury = {
      id: new Date().getTime() + 100000,
      accountId: TREASURY_ACCOUNT,
      allocatedPercent: "5",
      initialRelease: "0",
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
      allocatedPercent: "95",
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

  useEffect(() => {
    tokenFactoryStore.setToken(newToken);
  }, [newToken]);

  const handleDoTokenResume = async (token) => {
    if (!_.isEmpty(token.symbol)) {
      const queryParams = new URLSearchParams(location.search);

      try {
        const tokenState = await tokenFactoryStore.getTokenState(token);
        if (tokenState) {
          tokenFactoryStore.appendRegisteredToken({ ...tokenState, ...token });
          const {
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
            await tokenFactoryStore.createContract();
            // ft_contract_deployed = res != null ? 1 : 0;
          }
          if (deployer_contract_deployed === 0) {
            setAlert({
              open: true,
              message: "Creating deployer contract ...",
              color: "primary",
            });
            await tokenFactoryStore.createDeployerContract();
            // deployer_contract_deployed = res != null ? 1 : 0;
          }
          if (ft_issued === 0) {
            setAlert({
              open: true,
              message: "Issuing ...",
              color: "primary",
            });
            await tokenFactoryStore.issue();
            // ft_issued = res != null ? 1 : 0;
          }
          if (allocation_initialized === 0) {
            setAlert({
              open: true,
              message: "Initiating token allocation ...",
              color: "primary",
            });
            const res = await tokenFactoryStore.initTokenAllocation();
            if (res) {
              // initNewToken();
              // allocation_initialized = 1;
              queryParams.delete("resume_token");
              queryParams.delete("transactionHashes");
              history.replace({
                search: queryParams.toString(),
              });

              setAlert({
                open: true,
                message: (
                  <>
                    <Typography variant="h5" color="#fff">
                      Create token success. Do you want{" "}
                      <Link
                        component="button"
                        color="primary"
                        variant="h5"
                        onClick={() => {
                          tokenFactoryStore.setActiveStep(-1);
                          initNewToken();
                          setAlert({
                            open: false,
                            message: "",
                            color: "success",
                          });
                        }}
                      >
                        create new token
                      </Link>{" "}
                      ?
                    </Typography>
                  </>
                ),
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
  };

  const handleResumeToken = async (contract) => {
    const queryParams = new URLSearchParams(location.search);
    const resumeToken = queryParams.get("resume_token");
    const transactionHash = queryParams.get("transactionHashes");
    let token = null;
    let isContinuesProgress = !_.isEmpty(transactionHash) || !_.isEmpty(resumeToken);
    setIsResume(isContinuesProgress);

    if (contract) {
      // let token = localStorage.getItem(LOCAL_STORAGE_CURRENT_TOKEN);

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
        isContinuesProgress = true;
        setNewToken(token);
      }
      if (!_.isEmpty(resumeToken)) {
        token = tokenFactoryStore.registeredTokens.find((rt) => rt.symbol === resumeToken);
        isContinuesProgress = true;
        setNewToken(token);
      }
      if (isContinuesProgress) await handleDoTokenResume(token);
    }
  };

  useEffect(() => {
    let isProgress = false;
    const getListAllTokenContracts = async () => {
      if (!isProgress) {
        const lstAllTokens = await tokenFactoryStore.getListAllTokenContracts();
        tokenFactoryStore.setAllTokens(lstAllTokens);
      }
    };

    const init = async () => {
      await getListAllTokenContracts();
      if (!_.isEmpty(tokenStore.accountId) && !isProgress) {
        initNewToken();
        try {
          const lstMyToken = tokenFactoryStore.allTokens.filter(
            (t) => t.creator === tokenStore.accountId
          );
          const mergeLst = await tokenFactoryStore.getDeployerState(lstMyToken);
          tokenFactoryStore.setRegisteredTokens(mergeLst);
          const contract = await tokenFactoryStore.initContract();
          await handleResumeToken(contract);
        } catch (error) {
          console.log(error);
        }
      }
    };
    init();
    return () => {
      isProgress = true;
    };
  }, [tokenStore.accountId]);

  return (
    <DashboardLayout>
      <TokenNavbar />
      <SuiBox py={3}>
        <SuiBox mb={3}>
          <TokenFactoryStepper alert={alert} />
        </SuiBox>
        <SuiBox mb={3}>
          <CreateToken
            setAlert={setAlert}
            setToken={setNewToken}
            token={newToken}
            isResume={isResume}
          />
        </SuiBox>
      </SuiBox>
    </DashboardLayout>
  );
};
export default observer(TokenFactoryContainer);
