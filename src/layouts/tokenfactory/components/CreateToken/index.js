/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { Card, Grid, MenuItem, Select, Table } from "@mui/material";
import SuiBox from "components/SuiBox";
import SuiButton from "components/SuiButton";
import SuiInput from "components/SuiInput";
import SuiTypography from "components/SuiTypography";
import { TokenFactoryContext } from "layouts/tokenfactory/context/TokenFactoryContext";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import { useContext, useEffect, useState, useReducer } from "react";
import { humanize } from "humanize";
import AddIcon from "@mui/icons-material/Add";
import { LoadingButton } from "@mui/lab";
import moment from "moment";
import { observer } from "mobx-react";
import { AddAPhotoOutlined, BackupOutlined, DeleteOutlined } from "@mui/icons-material";
import { useDropzone } from "react-dropzone";
import { resizeImage } from "helpers/TokenUltis";
import { Allocation, TREASURY_ACCOUNT } from "layouts/tokenfactory/stores/TokenFactory.store";
import _ from "lodash";
import AllocationView from "../Allocation";

const CreateToken = (props) => {
  const { setAlert, token, setToken, isResume } = props;
  const { tokenFactoryStore } = useContext(TokenFactoryContext);
  const { tokenStore } = tokenFactoryStore;
  const [vestingStartTime, setVestingStartTime] = useState();
  const [vestingEndTime, setVestingEndTime] = useState(moment().add(30, "days"));
  // eslint-disable-next-line react/destructuring-assignment
  const [loading, setLoading] = useState(props.loading || false);
  const [totalSupply, setTotalSupply] = useState(tokenFactoryStore.registerParams.total_supply);
  const [tokenValidation, setTokenValidation] = useState(false);
  const [isAccountExist, setIsAccountExist] = useState(false);
  const [isAllocationValid, setIsAllocationValid] = useState(false);
  const initialAllocation = new Allocation();
  const [allocationRows, setAllocationRows] = useState([]);

  const { getRootProps, getInputProps } = useDropzone({
    accept: "image/jpeg, image/png",
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      resizeImage({ file: acceptedFiles[0], maxSize: 32 }).then((result) => {
        tokenFactoryStore.token.icon = result;
      });
    },
  });

  const { ref, ...rootProps } = getRootProps();

  const checkTokenValidation = async () => {
    let isValid = true;
    if (!tokenFactoryStore.token.tokenName || !tokenFactoryStore.token.symbol) {
      isValid = false;
      return isValid;
    }
    try {
      await tokenFactoryStore.checkExistenceToken(tokenFactoryStore.registerParams.ft_contract);
      await tokenFactoryStore.checkExistenceToken(
        tokenFactoryStore.registerParams.deployer_contract
      );
    } catch (error) {
      console.log("checkTokenValidation", error);
      if (error?.type !== "AccountDoesNotExist") {
        isValid = false;
        setIsAccountExist(true);
      }
    }

    return isValid;
  };

  useEffect(() => {
    setLoading(tokenFactoryStore.activeStep > -1 && tokenFactoryStore.activeStep <= 4);
  }, [tokenFactoryStore.activeStep]);

  useEffect(() => {
    if (!isResume) {
      setTokenValidation(false);
      setIsAccountExist(false);
      if (!_.isEmpty(tokenFactoryStore.token.symbol)) {
        if (window.delayCheckTokenValidation) clearTimeout(window.delayCheckTokenValidation);
        window.delayCheckTokenValidation = setTimeout(async () => {
          const res = await checkTokenValidation();
          setTokenValidation(res);
          setIsAccountExist(!res);
        }, 500);
      }
    }
  }, [tokenFactoryStore.token.symbol]);

  // Validate allocationList
  useEffect(() => {
    let isSumming = false;
    if (!isResume) {
      let sum = 0;
      let isAllAccountFilled = true;
      if (!isSumming) {
        token.allocationList.forEach((al) => {
          sum += parseInt(al.allocatedPercent, 10);
          if (_.isEmpty(al.accountId)) isAllAccountFilled = false;
        });
        console.log("SumAllocation", sum);
        setIsAllocationValid(sum === 100 && isAllAccountFilled);
      }
    }
    return () => {
      isSumming = true;
    };
  }, [token.allocationList]);

  const handleTokenNameChange = (e) => {
    setToken({ ...token, ...{ tokenName: e.target.value } });
  };

  const handleSymbolChange = (e) => {
    setToken({ ...token, ...{ symbol: e.target.value.toUpperCase() } });
  };

  const handleInitialSupplyChange = (e) => {
    setTotalSupply(e.target.value * 10 ** tokenFactoryStore.token.decimal);
    setToken({ ...token, ...{ initialSupply: e.target.value } });
  };

  const handleDecimalChange = (e) => {
    setTotalSupply(tokenFactoryStore.token.initialSupply * 10 ** e.target.value);
    setToken({ ...token, ...{ decimal: e.target.value } });
  };

  // const handleInitialReleasePercentChange = (e) => {
  //   tokenFactoryStore.setToken({ initialRelease: e.target.value });
  // };

  // const handleTreasuryPercentChange = (e) => {
  //   tokenFactoryStore.setToken({ treasury: e.target.value });
  // };

  // const handleVestingStartTimeChange = (value) => {
  //   setVestingStartTime(value);
  //   tokenFactoryStore.setToken({ vestingStartTime: value });
  // };

  // const handleVestingEndTimeChange = (value) => {
  //   setVestingEndTime(value);
  //   tokenFactoryStore.setToken({ vestingEndTime: value });
  // };

  // const handleVestingDurationChange = (e) => {
  //   setVestingEndTime(
  //     moment(vestingStartTime).add(e.target.value, "days").format("DD/MM/YY hh:mm a")
  //   );
  //   tokenFactoryStore.setToken({ vestingDuration: e.target.value });
  // };

  // const handleVestingIntervalChange = (e) => {
  //   tokenFactoryStore.setToken({ vestingInterval: e.target.value });
  // };

  const handleRegisterToken = async () => {
    try {
      setLoading(true);
      await tokenFactoryStore.register();
      setTimeout(() => {
        setLoading(false);
      }, 3000);
    } catch (error) {
      console.log("handleRegisterToken", error);
      setLoading(false);
      setAlert({
        open: true,
        message: error.message,
        color: "error",
      });
    }
  };

  return (
    <Grid container justifyContent="center" alignItems="center">
      <Grid item xs={12} md={10} lg={10}>
        <Card sx={{ margin: "auto", flexGrow: 10, p: 4 }}>
          <Grid container>
            <Grid item xs={12} md={6} lg={6} sx={{ pr: 1 }}>
              <SuiBox component="form" role="form">
                <SuiBox mb={2}>
                  <SuiBox mb={1} ml={0.5}>
                    <Grid container direction="row" justifyContent="space-between" sx={{ pt: 1 }}>
                      <SuiTypography component="label" variant="caption" fontWeight="bold" mb={1}>
                        Token Name
                      </SuiTypography>
                      {isAccountExist && (
                        <SuiTypography
                          component="h4"
                          variant="caption"
                          align="right"
                          sx={{ color: "#f44336", fontWeight: "600", fontStyle: "italic" }}
                        >
                          {tokenFactoryStore.token.symbol} already existed !
                        </SuiTypography>
                      )}
                      {/* <Grid item xs={6} alignContent="start"></Grid>
                      <Grid item xs={6} alignContent="end" alignItems="end"></Grid> */}
                    </Grid>
                  </SuiBox>
                  <SuiInput
                    disabled={loading}
                    required
                    type="text"
                    placeholder="Token Name"
                    onChange={handleTokenNameChange}
                    value={tokenFactoryStore.token.tokenName}
                    sx={isAccountExist ? { border: "1px solid red" } : { border: "inherited" }}
                  />
                </SuiBox>
                <SuiBox mb={3}>
                  <Grid container>
                    <Grid item xs={6} sx={{ pr: 1 }}>
                      <SuiBox mb={1} ml={0.5}>
                        <SuiTypography component="label" variant="caption" fontWeight="bold">
                          Symbol
                        </SuiTypography>
                      </SuiBox>
                      <SuiInput
                        disabled={loading}
                        required
                        type="text"
                        placeholder="Symbol"
                        onChange={handleSymbolChange}
                        value={tokenFactoryStore.token.symbol}
                        sx={isAccountExist ? { border: "1px solid red" } : { border: "inherited" }}
                      />
                    </Grid>
                    <Grid item xs={6} sx={{ pr: 1 }}>
                      <SuiBox mb={1} ml={0.5}>
                        <SuiTypography component="label" variant="caption" fontWeight="bold">
                          Icon
                        </SuiTypography>
                      </SuiBox>
                      <SuiBox {...rootProps} sx={{ float: "left" }} disabled={loading}>
                        <input disabled={loading} {...getInputProps()} />
                        {tokenFactoryStore.token.icon !== null ? (
                          <SuiBox>
                            <img src={tokenFactoryStore.token.icon} />
                          </SuiBox>
                        ) : (
                          <AddAPhotoOutlined fontSize="large" />
                        )}
                      </SuiBox>
                      {tokenFactoryStore.token.icon && !loading && (
                        <DeleteOutlined
                          sx={{ float: "right" }}
                          fontSize="medium"
                          disabled={loading}
                          onClick={() => {
                            tokenFactoryStore.token.icon = null;
                          }}
                        />
                      )}
                    </Grid>
                  </Grid>
                </SuiBox>
              </SuiBox>
            </Grid>
            <Grid item xs={12} md={6} lg={6} sx={{ pr: 1 }}>
              <SuiBox component="form" role="form">
                <SuiBox mb={2}>
                  <SuiBox mb={1} ml={0.5}>
                    <Grid container direction="row" justifyContent="space-between" sx={{ pt: 1 }}>
                      <SuiTypography component="label" variant="caption" fontWeight="bold" mb={1}>
                        Total Supply
                      </SuiTypography>
                      <SuiTypography component="label" variant="caption" align="right" color="red">
                        ~ {humanize.numberFormat(totalSupply)}
                      </SuiTypography>
                      {/* <Grid item xs={6} alignContent="start"></Grid>
                      <Grid item xs={6} alignContent="end" alignItems="end"></Grid> */}
                    </Grid>
                  </SuiBox>
                  <Select
                    disabled={loading}
                    value={tokenFactoryStore.token.initialSupply}
                    onChange={handleInitialSupplyChange}
                    input={<SuiInput />}
                  >
                    <MenuItem value={100000000}>{humanize.numberFormat(100000000)}</MenuItem>
                  </Select>
                  {/* <SuiInput
                    disabled={loading}
                    required
                    type="number"
                    placeholder="Initial Supply"
                    value={tokenFactoryStore.token.initialSupply}
                    // defaultValue={tokenFactoryStore.token.initialSupply}
                    onChange={handleInitialSupplyChange}
                  /> */}
                </SuiBox>
                <SuiBox mb={2}>
                  <SuiBox mb={1} ml={0.5}>
                    <SuiTypography component="label" variant="caption" fontWeight="bold">
                      Decimals (1-18)
                    </SuiTypography>
                  </SuiBox>
                  <Select
                    disabled={loading}
                    value={tokenFactoryStore.token.decimal}
                    onChange={handleDecimalChange}
                    input={<SuiInput />}
                  >
                    <MenuItem value={8}>8</MenuItem>
                  </Select>
                  {/* <SuiInput
                    disabled={loading}
                    required
                    type="number"
                    defaultValue={tokenFactoryStore.token.decimal}
                    onChange={handleDecimalChange}
                  /> */}
                </SuiBox>
              </SuiBox>
            </Grid>
            <Grid item xs={12} sx={{ pr: 1 }}>
              <SuiBox mb={2}>
                <SuiBox mb={1} ml={0.5}>
                  <SuiTypography component="label" variant="caption" fontWeight="bold">
                    Allocations
                  </SuiTypography>
                </SuiBox>
              </SuiBox>
              <SuiBox mb={2}>
                <Table
                  columns={[
                    { title: "Token Name", name: "token_name", align: "left" },
                    { title: "Symbol", name: "symbol", align: "left" },
                    { title: "Total Supply", name: "total_supply", align: "left" },
                    // { title: "Vesting Start Time", name: "vesting_start_time", align: "center" },
                    // { title: "Vesting End Time", name: "vesting_end_time", align: "center" },
                    // { title: "Vesting Interval (days)", name: "vesting_interval", align: "center" },
                    // { title: "Allocation", name: "allocated_num", align: "center" },
                    { title: "Claimable", name: "claimable_amount", align: "center" },
                    { title: "Claimed", name: "claimed", align: "center" },
                    { title: "", name: "action", align: "right" },
                  ]}
                  rows={allocationRows}
                />
              </SuiBox>
              <Grid container spacing={2} sx={{ mb: 2 }}>
                {token.allocationList.map((tk, index) => (
                  <Grid key={(tk.id + index).toString()} item xs={12} md={6} lg={4}>
                    <Card sx={{ p: 2, boxShadow: 4 }}>
                      <AllocationView
                        allocation={tk}
                        loading={loading}
                        onChange={(allocation) => {
                          const alCache = [...token.allocationList];
                          const i = token.allocationList.findIndex((al) => al.id === allocation.id);
                          if (i > -1) {
                            alCache[i] = allocation;
                            console.log(alCache);
                            const t = { ...token };
                            t.allocationList = alCache;
                            setToken(t);
                          }
                        }}
                        tokenStore={tokenStore}
                      />
                      {tk.accountId !== TREASURY_ACCOUNT && tk.accountId !== tokenStore.accountId && (
                        <SuiBox sx={{ textAlign: "center" }}>
                          <SuiButton
                            disabled={loading}
                            color="error"
                            variant="outlined"
                            onClick={() => {
                              const t = { ...token };
                              t.allocationList = token.allocationList.filter(
                                (al) => al.id !== tk.id
                              );

                              setToken(t);
                            }}
                          >
                            <DeleteRoundedIcon />
                          </SuiButton>
                        </SuiBox>
                      )}
                    </Card>
                  </Grid>
                ))}
                <Grid key="add-more-allocation" item xs={12} md={6} lg={4}>
                  <SuiBox>
                    <SuiButton
                      color="primary"
                      disabled={!isAllocationValid || loading}
                      variant="gradient"
                      onClick={() => {
                        const t = { ...token };
                        const newItem = {
                          ...initialAllocation,
                          ...{
                            id: new Date().getTime(),
                          },
                        };
                        const alCache = [...token.allocationList, ...[newItem]];
                        t.allocationList = alCache;
                        setToken(t);
                      }}
                      sx={{ width: "100%", height: "100%" }}
                    >
                      <AddIcon />
                    </SuiButton>
                  </SuiBox>
                </Grid>
              </Grid>
            </Grid>
            <SuiBox mt={4} mb={1}>
              {tokenStore.isSignedIn ? (
                <>
                  {!isAllocationValid && (
                    <SuiTypography
                      component="h4"
                      variant="caption"
                      fontWeight="bold"
                      sx={{ color: "red", mb: 4 }}
                    >
                      Total allocations is difference from 100 percent !
                    </SuiTypography>
                  )}
                  <LoadingButton
                    disabled={loading || !tokenValidation || !isAllocationValid}
                    sx={{
                      background: "linear-gradient(to left, #642b73, #c6426e)",
                      color: "#fff",
                    }}
                    onClick={handleRegisterToken}
                    loading={loading}
                    loadingPosition="start"
                    startIcon={<BackupOutlined color="#fff" fontSize="large" />}
                    variant="contained"
                  >
                    Create Token
                  </LoadingButton>
                </>
              ) : (
                <SuiButton
                  color="primary"
                  variant="gradient"
                  onClick={() => {
                    tokenStore.login();
                  }}
                  sx={{ width: "100%" }}
                >
                  Connect Wallet
                </SuiButton>
              )}
            </SuiBox>
          </Grid>
        </Card>
      </Grid>
    </Grid>
  );
};

export default observer(CreateToken);
