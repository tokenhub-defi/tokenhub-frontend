/* eslint-disable default-case */
/* eslint-disable no-console */
import { Card, Grid, Paper, Skeleton, Typography } from "@mui/material";
import SuiBox from "components/SuiBox";
import { formatTokenAmountToHumanReadable } from "helpers/TokenUltis";
import { TokenSalesContext } from "layouts/tokensales/context/TokenSalesContext";
import { observer } from "mobx-react";
import { useContext, useEffect } from "react";
import SuiButton from "components/SuiButton";
import SalesForm from "../SalesForm";

export const ACTION = {
  DEPOSIT: "DEPOSIT",
  WITHDRAWAL: "WITHDRAWAL",
  REDEEM: "REDEEM",
  CLAIM: "CLAIM",
};

export const TokenSalesFormSkeleton = () => (
  <>
    <Paper
      component="div"
      sx={{
        p: "2px 4px",
        display: "flex",
        alignItems: "center",
        width: "100%",
        marginTop: "10px",
      }}
    >
      <Typography variant="h2" component="div" sx={{ width: "100%" }}>
        <Skeleton />
      </Typography>
    </Paper>
    <Paper
      component="div"
      sx={{
        p: "2px 4px",
        display: "flex",
        alignItems: "center",
        width: "100%",
        marginTop: "10px",
      }}
    >
      <Typography variant="h2" component="div" sx={{ width: "100%" }}>
        <Skeleton />
      </Typography>
    </Paper>
    <Paper
      component="div"
      sx={{
        p: "2px 4px",
        display: "flex",
        alignItems: "center",
        width: "100%",
        marginTop: "10px",
      }}
    >
      <Typography variant="h2" component="div" sx={{ width: "100%" }}>
        <Skeleton />
      </Typography>
    </Paper>
  </>
);

const TokenSalesForm = () => {
  const { tokenSalesStore } = useContext(TokenSalesContext);
  const { userContract, tokenContract, tokenStore } = tokenSalesStore;
  const { nearUtils } = tokenStore;
  let { loading } = tokenSalesStore;
  // const [action, setAction] = useState();

  useEffect(() => {
    if (!tokenStore.isSignedIn) {
      tokenSalesStore.removeUseData();
    }
  }, [tokenStore.isSignedIn]);

  const handleSubmitClick = async (action) => {
    loading = true;
    try {
      switch (action) {
        case ACTION.DEPOSIT:
          await tokenSalesStore.submitDeposit();
          break;
        case ACTION.WITHDRAWAL:
          await tokenSalesStore.submitWithdrawal();
          break;
        case ACTION.REDEEM:
          await tokenSalesStore.submitRedeem();
          break;
        case ACTION.CLAIM:
          await tokenSalesStore.submitClaim();
          break;
      }
    } catch (error) {
      console.log(error);
    }
    loading = false;
    // setOpenConfirmDialog(false);
  };

  const handleRedeemValue = () => {
    if (userContract?.total_allocated_tokens) {
      return formatTokenAmountToHumanReadable(
        userContract.total_allocated_tokens,
        tokenContract.tokenInfo.decimals
      );
    }
    return 0;
  };
  return (
    <>
      <Card>
        <SuiBox p={2}>
          {userContract ? (
            <Grid container spacing={3}>
              <Grid item xs={12} lg={12}>
                <SuiBox display="flex" flexDirection="column" height="100%">
                  <SalesForm
                    helperText="Please enter your deposit"
                    label={`Deposit : ${nearUtils.format.formatNearAmount(
                      userContract?.deposit || 0
                    )}`}
                    disabled={!(tokenContract?.tokenPeriod === "ON_SALE")}
                    buttonDisable={tokenSalesStore.deposit === 0}
                    onTextChange={(e) => {
                      tokenSalesStore.deposit = e.target.value;
                    }}
                    onButtonClick={() => {
                      handleSubmitClick(ACTION.DEPOSIT);
                      // setOpenConfirmDialog(true);
                    }}
                    loading={loading}
                    adornment="NEAR"
                    buttonText="Deposit"
                  />

                  <SalesForm
                    helperText="Please enter your withdraw"
                    label="Withdrawal"
                    disabled={
                      !(
                        tokenContract?.tokenPeriod === "ON_SALE" ||
                        tokenContract?.tokenPeriod === "ON_GRACE"
                      )
                    }
                    buttonDisable={tokenSalesStore.withdraw === 0}
                    onTextChange={(e) => {
                      tokenSalesStore.withdraw = e.target.value;
                    }}
                    onButtonClick={() => {
                      handleSubmitClick(ACTION.WITHDRAWAL);
                    }}
                    loading={loading}
                    adornment="NEAR"
                    buttonText="Withdrawal"
                  />

                  <SalesForm
                    helperText="Please enter your redeem"
                    label="Redeem"
                    defaultValue={handleRedeemValue()}
                    buttonDisable={
                      userContract?.is_redeemed === 1 || tokenContract.tokenPeriod !== "FINISHED"
                    }
                    disabled={
                      userContract?.is_redeemed === 1 || tokenContract.tokenPeriod !== "FINISHED"
                    }
                    onTextChange={(e) => {
                      tokenSalesStore.redeem = e.target.value;
                    }}
                    onButtonClick={() => {
                      handleSubmitClick(ACTION.REDEEM);
                    }}
                    loading={loading}
                    adornment={tokenContract.tokenInfo.symbol || ""}
                    buttonText="Redeem"
                  />

                  {tokenContract.saleInfo?.sale_owner === tokenStore.accountId && (
                    <SalesForm
                      label="Claim"
                      defaultValue={tokenContract.totalDeposit.formatted_amount}
                      buttonDisable={
                        tokenContract.saleInfo?.fund_claimed ||
                        tokenContract.tokenPeriod !== "FINISHED"
                      }
                      disabled={
                        tokenContract.saleInfo?.fund_claimed ||
                        tokenContract.tokenPeriod !== "FINISHED"
                      }
                      onButtonClick={() => {
                        handleSubmitClick(ACTION.CLAIM);
                      }}
                      loading={loading}
                      adornment="NEAR"
                      buttonText="Claim"
                    />
                  )}
                </SuiBox>
              </Grid>
            </Grid>
          ) : (
            <>
              {tokenStore.isSignedIn ? (
                <TokenSalesFormSkeleton />
              ) : (
                <SuiButton
                  color="primary"
                  variant="gradient"
                  onClick={() => {
                    tokenStore.login();
                  }}
                  sx={{ width: "100%", mt: "1rem" }}
                >
                  Connect Wallet
                </SuiButton>
              )}
            </>
          )}
        </SuiBox>
      </Card>
    </>
  );
};
export default observer(TokenSalesForm);
