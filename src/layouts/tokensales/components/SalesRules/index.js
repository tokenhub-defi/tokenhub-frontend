/* eslint-disable import/named */
import { Card, Grid } from "@mui/material";
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
            <SuiTypography variant="h4" component="div">
              Sale rules
            </SuiTypography>
            <SuiTypography variant="h6" component="div">
              <ArrowRight fontSize="medium" sx={{ verticalAlign: "middle" }} color="primary" />
              There are 2 periods: Sale and Grace.
            </SuiTypography>
            <SuiTypography variant="h6" component="div">
              <ArrowRight fontSize="medium" sx={{ verticalAlign: "middle" }} color="primary" />
              In Sale period: users can deposit and withdraw.
            </SuiTypography>
            <SuiTypography variant="h6" component="div">
              <ArrowRight fontSize="medium" sx={{ verticalAlign: "middle" }} color="primary" />
              In Grace period: users can only withdraw.
            </SuiTypography>
            <SuiTypography variant="h6" component="div">
              <ArrowRight fontSize="medium" sx={{ verticalAlign: "middle" }} color="primary" />
              At any point of time, the price is calculated by the total deposit divided by the
              total number of tokens for sale.
            </SuiTypography>
            <SuiTypography variant="h6" component="div">
              <ArrowRight fontSize="medium" sx={{ verticalAlign: "middle" }} color="primary" />
              After the grace period ends, the sale finishes and the price is finalized.
            </SuiTypography>
            <SuiTypography variant="h6" component="div">
              <ArrowRight fontSize="medium" sx={{ verticalAlign: "middle" }} color="primary" />
              At that point, tokens are allocated to users based on their deposit. Users can redeem
              to their wallets.
            </SuiTypography>
          </SuiBox>
        </Grid>
      </Grid>
    </SuiBox>
  </Card>
);

export default observer(SalesRules);
