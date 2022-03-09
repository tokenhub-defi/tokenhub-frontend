/* eslint-disable react/prop-types */
/* eslint-disable prettier/prettier */
import { Card, Grid } from "@mui/material";
import SuiAlert from "components/SuiAlert";
import SuiBox from "components/SuiBox";
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
          {alert.open && (
            <Grid container justifyContent="center" alignItems="center">
              <Grid item xs={10}>
                <SuiBox>
                  <SuiAlert color={alert.color}>{alert.message}</SuiAlert>
                </SuiBox>
              </Grid>
            </Grid>
          )}
        </Card>
      </Grid>
    </Grid>
  );
};
export default observer(TokenFactoryStepper);
