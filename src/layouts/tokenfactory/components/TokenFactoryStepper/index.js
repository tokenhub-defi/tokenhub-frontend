/* eslint-disable react/prop-types */
/* eslint-disable prettier/prettier */
import { Card, Grid, Stack } from "@mui/material";
import SuiAlert from "components/SuiAlert";
import { TokenFactoryContext } from "layouts/tokenfactory/context/TokenFactoryContext";
import { observer } from "mobx-react";
import { useContext } from "react";
import CustomizedSteppers from "./CustomizedSteppers";

const TokenFactoryStepper = (props) => {
  const { alert } = props;
  const { tokenFactoryStore } = useContext(TokenFactoryContext);
  return (
    <Grid container justifyContent="center" alignItems="center">
      <Grid item xs={8}>
        <Card>
          <CustomizedSteppers
            steps={tokenFactoryStore.steps}
            activeStep={tokenFactoryStore.activeStep}
          />
          <Stack sx={{ width: "100%" }} spacing={4}>
            <SuiAlert color={alert.color} dismissible>
              {alert.message}
            </SuiAlert>
          </Stack>
        </Card>
      </Grid>
    </Grid>
  );
};
export default observer(TokenFactoryStepper);
