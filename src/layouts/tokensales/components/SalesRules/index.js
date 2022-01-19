/* eslint-disable import/named */
import { Card, Grid, Typography } from "@mui/material";
import SuiBox from "components/SuiBox";
import { observer } from "mobx-react";
import SuiTypography from "components/SuiTypography";
import { ArrowRight } from "@mui/icons-material";

const SalesRules = () => (
  <Card sx={{ marginTop: "1.5rem" }}>
    <SuiBox p={2}>
      <Grid container spacing={3}>
        <Grid item xs={12} lg={12}>
          <SuiBox display="flex" flexDirection="column" height="100%">
            <Typography variant="h4" component="div" sx={{ mb: 1 }}>
              Sale rules
            </Typography>
            <SuiTypography variant="h6" component="div">
              <ArrowRight fontSize="medium" sx={{ verticalAlign: "middle" }} color="primary" />
              There are 2 periods: Sale and Grace.
            </SuiTypography>
            <SuiTypography variant="h6" component="div">
              <ArrowRight fontSize="medium" sx={{ verticalAlign: "middle" }} color="primary" />
              During Sale period, users can deposit and withdraw.
            </SuiTypography>
            <SuiTypography variant="h6" component="div">
              <ArrowRight fontSize="medium" sx={{ verticalAlign: "middle" }} color="primary" />
              During Grace period, users can only withdraw.
            </SuiTypography>
            <SuiTypography variant="h6" component="div">
              <ArrowRight fontSize="medium" sx={{ verticalAlign: "middle" }} color="primary" />
              The token price is calculated as the total deposit divided by the total number of
              tokens.
            </SuiTypography>
            <SuiTypography variant="h6" component="div">
              <ArrowRight fontSize="medium" sx={{ verticalAlign: "middle" }} color="primary" />
              The token sale is finished after Grace period. The token price will be finalized.
            </SuiTypography>
            <SuiTypography variant="h6" component="div">
              <ArrowRight fontSize="medium" sx={{ verticalAlign: "middle" }} color="primary" />
              Finally tokens are allocated to users based on their deposit. Users can redeem to
              their wallet.
            </SuiTypography>
          </SuiBox>
        </Grid>
      </Grid>
    </SuiBox>
  </Card>
);

export default observer(SalesRules);
