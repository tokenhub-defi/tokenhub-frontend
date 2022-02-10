/* eslint-disable react/prop-types */
import { useEffect } from "react";
import { Avatar, Box, Card, Slider } from "@mui/material";
import SuiBox from "components/SuiBox";
import SuiButton from "components/SuiButton";
import CheckIcon from "@mui/icons-material/Check";
import { FiberManualRecord } from "@mui/icons-material";
import SuiTypography from "components/SuiTypography";
import { observer } from "mobx-react";
import "./TokenSalesItem.scss";

const TokenSalesItem = (props) => {
  const { token, onClick } = props;
  useEffect(() => {}, []);
  return (
    <Card
      className="token-sales-item"
      onClick={() => {
        onClick(token);
      }}
    >
      <SuiBox p={2}>
        <SuiBox p={2} sx={{ textAlign: "right" }}>
          <SuiButton variant="gradient" disabled sx={{ marginRight: 1 }} color="primary">
            <CheckIcon />
          </SuiButton>
          <SuiButton variant="gradient" disabled color="primary">
            <FiberManualRecord color="warning" /> {token.status}
          </SuiButton>
        </SuiBox>
        <SuiBox p={2}>
          <SuiTypography component="label" variant="h5" fontWeight="bold">
            <Avatar src={token.icon} sx={{ float: "left", mr: "1rem" }} />{" "}
            {`${token.name} (${token.symbol})`}
          </SuiTypography>
          <Box className="slider-container">
            <Slider
              className="slider-total"
              min={token.min}
              max={token.max}
              value={[token.min, token.max]}
              defaultValue={token.total}
              disabled
              marks={[
                {
                  value: token.min,
                  label: (
                    <Box sx={{ ml: "5rem" }}>
                      <SuiTypography component="p" variant="caption" fontWeight="bold">
                        Min raise
                      </SuiTypography>
                      <SuiTypography component="p" variant="h5" fontWeight="bold">
                        ${token.min} NEAR
                      </SuiTypography>
                    </Box>
                  ),
                },
                {
                  value: token.max,
                  label: (
                    <Box sx={{ mr: "5rem" }}>
                      <SuiTypography component="p" variant="caption" fontWeight="bold">
                        Max raise
                      </SuiTypography>
                      <SuiTypography component="p" variant="h5" fontWeight="bold">
                        ${token.max} NEAR
                      </SuiTypography>
                    </Box>
                  ),
                },
                {
                  value: token.total,
                  label: (
                    <Box sx={{ mt: "-4rem" }}>
                      <SuiTypography component="p" variant="caption" fontWeight="bold">
                        Total raise
                      </SuiTypography>
                      <SuiTypography component="p" variant="h5" fontWeight="bold">
                        ${token.total} NEAR
                      </SuiTypography>
                    </Box>
                  ),
                },
              ]}
              getAriaValueText={(value) => `${value} NEAR`}
              valueLabelFormat={(value) => `${value} NEAR`}
              valueLabelDisplay="auto"
            />
            <SuiTypography component="label" variant="caption" fontWeight="bold">
              Auction Token Price:
            </SuiTypography>
            <SuiTypography component="p" variant="h5" fontWeight="bold" color="primary">
              {token.price}
            </SuiTypography>
          </Box>
        </SuiBox>
        <SuiBox pl={2} pr={2}>
          <SuiTypography component="label" variant="caption" fontWeight="bold">
            Auction Type:
          </SuiTypography>
          <SuiTypography component="p" variant="h5" fontWeight="bold" color="primary">
            {token.saleType}
          </SuiTypography>
        </SuiBox>
      </SuiBox>
    </Card>
  );
};
export default observer(TokenSalesItem);
