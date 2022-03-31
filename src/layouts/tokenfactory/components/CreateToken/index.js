/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { Box, Card, Grid, List, ListItem, ListItemText, TextField } from "@mui/material";
import SuiBox from "components/SuiBox";
import SuiButton from "components/SuiButton";
import SuiInput from "components/SuiInput";
import SuiTypography from "components/SuiTypography";
import { TokenFactoryContext } from "layouts/tokenfactory/context/TokenFactoryContext";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import { useContext, useEffect, useState, useReducer, useRef } from "react";
import { humanize } from "humanize";
import AddIcon from "@mui/icons-material/Add";
import { LoadingButton } from "@mui/lab";
import { observer } from "mobx-react";
import { v4 } from "uuid";
import {
  AddAPhotoOutlined,
  BackupOutlined,
  DeleteOutlined,
  ErrorOutline,
  PriorityHigh,
  PriorityHighOutlined,
  PriorityHighRounded,
} from "@mui/icons-material";
import { useDropzone } from "react-dropzone";
import { resizeImage } from "helpers/TokenUltis";
import { Allocation, TREASURY_ACCOUNT } from "layouts/tokenfactory/stores/TokenFactory.store";
import _ from "lodash";
import NumberFormat from "react-number-format";
import AllocationView from "../Allocation";
import "./createToken.scss";

const MIN_DECIMAL = 8;
const MAX_DECIMAL = 24;
const MIN_TOTAL_SUPPLY = 10000;
const MAX_TOTAL_SUPPLY = 10000000000000000000;
const CreateToken = (props) => {
  const { setAlert, token, setToken, isResume } = props;
  const { tokenFactoryStore } = useContext(TokenFactoryContext);
  const { tokenStore } = tokenFactoryStore;
  // eslint-disable-next-line react/destructuring-assignment
  const [loading, setLoading] = useState(props.loading || false);
  const [totalSupply, setTotalSupply] = useState(tokenFactoryStore.registerParams.total_supply);
  const [tokenValidation, setTokenValidation] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    {
      isTokenNameEmpty: false,
      isTokenSymbolEmpty: false,
      isAccountExist: false,
      sumAllocation: 100,
      notValidAllocation: [],
    }
  );
  const initialAllocation = new Allocation();

  const totalSuppyInputRef = useRef();
  const decimalInputRef = useRef();

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

  const validateTokenSymbol = async () => {
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
      if (error?.type !== "AccountDoesNotExist") {
        isValid = false;
      }
    }

    return isValid;
  };

  const validateTokenAllocation = () => {
    const notValid = [];
    let sum = 0;

    token.allocationList.forEach((item) => {
      let isValid = true;
      if (_.isEmpty(item.accountId)) isValid = false;
      if (parseFloat(item.allocatedPercent) > 100 || parseFloat(item.allocatedPercent) < 1) {
        isValid = false;
      }
      if (
        parseFloat(item.initialRelease) > 100 ||
        parseFloat(item.initialRelease) < 1 ||
        parseFloat(item.initialRelease) > parseFloat(item.allocatedPercent)
      ) {
        isValid = false;
      }
      sum += parseInt(item.allocatedPercent, 10);

      if (!isValid) {
        notValid.push(item);
      }
    });

    return {
      NotValidAllocation: notValid,
      Sum: sum,
    };
  };

  useEffect(() => {
    setLoading(tokenFactoryStore.activeStep > -1 && tokenFactoryStore.activeStep <= 5);
  }, [tokenFactoryStore.activeStep]);

  const handleTokenNameChange = (e) => {
    setToken({ ...token, ...{ tokenName: e.target.value } });
  };

  const handleSymbolChange = (e) => {
    setToken({ ...token, ...{ symbol: e.target.value.toUpperCase() } });
  };

  const handleInitialSupplyChange = (values) => {
    const { formattedValue, value } = values;
    // if (totalSuppyInputRef.current.onChangeTimeout) clearTimeout(totalSuppyInputRef.current.onChangeTimeout);
    // totalSuppyInputRef.current.onChangeTimeout = setTimeout(() => {
    //   if (tSupply < MIN_TOTAL_SUPPLY) tSupply = MIN_TOTAL_SUPPLY;
    //   if (tSupply > MAX_TOTAL_SUPPLY) tSupply = MAX_TOTAL_SUPPLY;
    //   setTotalSupply(tSupply * 10 ** tokenFactoryStore.token.decimal);
    //   setToken({ ...token, ...{ initialSupply: tSupply } });
    // }, 500);
    setTotalSupply(value * 10 ** tokenFactoryStore.token.decimal);
    setToken({ ...token, ...{ initialSupply: value } });
    console.log(tokenFactoryStore.registerParams.total_supply);
  };

  const handleDecimalChange = (e) => {
    const decimalT = e.target.value;
    // if (decimalInputRef.current.onChangeTimeout) clearTimeout(decimalInputRef.current.onChangeTimeout);
    // decimalInputRef.current.onChangeTimeout = setTimeout(() => {
    //   if (decimalT < MIN_DECIMAL) decimalT = MIN_DECIMAL;
    //   if (decimalT > MAX_DECIMAL) decimalT = MAX_DECIMAL;
    //   setTotalSupply(tokenFactoryStore.token.initialSupply * 10 ** decimalT);
    //   setToken({ ...token, ...{ decimal: decimalT } });
    // }, 500);
    setTotalSupply(tokenFactoryStore.token.initialSupply * 10 ** decimalT);
    setToken({ ...token, ...{ decimal: decimalT } });
  };

  const validateNewToken = async () => {
    const allocationValid = validateTokenAllocation();
    const symbolValid = await validateTokenSymbol();
    setTokenValidation({
      isTokenNameEmpty: _.isEmpty(token.tokenName),
      isTokenSymbolEmpty: _.isEmpty(token.symbol),
      isAccountExist: !symbolValid,
      sumAllocation: allocationValid.Sum,
      notValidAllocation: allocationValid.NotValidAllocation,
    });
    return (
      symbolValid && allocationValid.Sum === 100 && allocationValid.NotValidAllocation?.length === 0
    );
  };

  const handleRegisterToken = async () => {
    const isTokenValid = await validateNewToken();
    if (!isTokenValid) return;
    try {
      setLoading(true);
      await tokenFactoryStore.register();
      setTimeout(() => {
        setLoading(false);
      }, 3000);
    } catch (error) {
      setLoading(false);
      setAlert({
        open: true,
        message: error.message,
        color: "error",
      });
    }
  };

  const buildAllocationView = () => {
    const views = token.allocationList.map((tk, index) => {
      let notValidCss = {};
      if (tokenValidation.notValidAllocation.findIndex((tv) => tv.id === tk.id) > -1) {
        notValidCss = { border: "1px solid red" };
      }
      return (
        <Grid key={(tk.id + index).toString()} item xs={12} md={6} lg={4}>
          <Card sx={{ ...{ p: 2, boxShadow: 4 }, ...notValidCss }}>
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
                    t.allocationList = token.allocationList.filter((al) => al.id !== tk.id);

                    setToken(t);
                  }}
                >
                  <DeleteRoundedIcon />
                </SuiButton>
              </SuiBox>
            )}
          </Card>
        </Grid>
      );
    });
    return views;
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
                    </Grid>
                  </SuiBox>
                  <SuiInput
                    disabled={loading}
                    required
                    type="text"
                    placeholder="Token Name"
                    onChange={handleTokenNameChange}
                    value={tokenFactoryStore.token.tokenName}
                    sx={
                      (tokenValidation.isAccountExist || tokenValidation.isTokenNameEmpty) &&
                        !isResume
                        ? { border: "1px solid red" }
                        : { border: "inherited" }
                    }
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
                        sx={
                          (tokenValidation.isAccountExist || tokenValidation.isTokenSymbolEmpty) &&
                            !isResume
                            ? { border: "1px solid red" }
                            : { border: "inherited" }
                        }
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
                    </Grid>
                  </SuiBox>
                  <NumberFormat
                    disabled={loading}
                    required
                    placeholder="Total Supply"
                    className="total-supply"
                    thousandSeparator
                    value={token.initialSupply}
                    customInput={SuiInput}
                    onValueChange={handleInitialSupplyChange}
                    isAllowed={({ floatValue }) => floatValue >= MIN_TOTAL_SUPPLY && floatValue <= MAX_TOTAL_SUPPLY}
                  />

                  {/* <TextField
                    ref={totalSuppyInputRef}
                    disabled={loading}
                    required
                    type="number"
                    placeholder="Total Supply"
                    className="total-supply"
                    value={humanize.numberFormat(tokenFactoryStore.token.initialSupply)}
                    // defaultValue={tokenFactoryStore.token.initialSupply}
                    onChange={handleInitialSupplyChange}
                    inputProps={{
                      inputMode: "numeric",
                      min: MIN_TOTAL_SUPPLY,
                      max: MAX_TOTAL_SUPPLY,
                    }}
                    fullWidth
                  /> */}
                </SuiBox>
                <SuiBox mb={2}>
                  <SuiBox mb={1} ml={0.5}>
                    <SuiTypography component="label" variant="caption" fontWeight="bold">
                      Decimals (8-24)
                    </SuiTypography>
                  </SuiBox>

                  <TextField
                    ref={decimalInputRef}
                    disabled={loading}
                    required
                    type="number"
                    className="decimal"
                    value={tokenFactoryStore.token.decimal}
                    onChange={handleDecimalChange}
                    inputProps={{
                      inputMode: "numeric",
                      min: MIN_DECIMAL,
                      max: MAX_DECIMAL,
                    }}
                    fullWidth
                  />
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
              <Grid container spacing={2} sx={{ mb: 2 }}>
                {buildAllocationView()}
                <Grid key="add-more-allocation" item xs={12} md={6} lg={4}>
                  <SuiBox>
                    <SuiButton
                      color="primary"
                      disabled={loading}
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
            <SuiBox mt={2} mb={2}>
              {tokenStore.isSignedIn ? (
                <SuiBox>
                  {(tokenValidation.sumAllocation !== 100 ||
                    tokenValidation.isAccountExist ||
                    tokenValidation.isTokenNameEmpty ||
                    tokenValidation.isTokenSymbolEmpty ||
                    tokenValidation.notValidAllocation.length > 0) && (
                      <Card
                        sx={{
                          mb: 3,
                          flexGrow: 10,
                          p: 4,
                          border: "1px solid red",
                          boxShadow: 4,
                        }}
                      >
                        {tokenValidation.sumAllocation !== 100 && (
                          <SuiTypography component="h6" variant="h6" fontWeight="bold">
                            <PriorityHigh fontSize="medium" color="error" sx={{ mb: "-5px" }} />
                            Total allocations is difference from 100 percent !
                          </SuiTypography>
                        )}
                        {tokenValidation.isTokenNameEmpty && (
                          <SuiTypography component="h6" variant="h6" fontWeight="bold">
                            <PriorityHigh fontSize="medium" color="error" sx={{ mb: "-5px" }} />
                            Token name is empty !
                          </SuiTypography>
                        )}
                        {tokenValidation.isTokenSymbolEmpty && (
                          <SuiTypography component="h6" variant="h6" fontWeight="bold">
                            <PriorityHigh fontSize="medium" color="error" sx={{ mb: "-5px" }} />
                            Token symbol is empty !
                          </SuiTypography>
                        )}
                        {tokenValidation.isAccountExist && (
                          <SuiTypography component="h6" variant="h6" fontWeight="bold">
                            <PriorityHigh fontSize="medium" color="error" sx={{ mb: "-5px" }} />
                            Account [{tokenFactoryStore.registerParams.ft_contract}] existed !
                          </SuiTypography>
                        )}
                        {tokenValidation.notValidAllocation?.length > 0 &&
                          tokenValidation.notValidAllocation.map((nva) => (
                            <SuiTypography key={v4()} component="h6" variant="h6" fontWeight="bold">
                              <PriorityHigh fontSize="medium" color="error" sx={{ mb: "-5px" }} />
                              Allocation [{nva.accountId}] is not valid !
                            </SuiTypography>
                          ))}
                      </Card>
                    )}
                  <LoadingButton
                    disabled={loading}
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
                </SuiBox>
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
