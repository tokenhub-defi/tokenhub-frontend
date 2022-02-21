/* eslint-disable react/prop-types */
import { useEffect } from "react";
import { Avatar, Box, Card, Slider, Skeleton, Link } from "@mui/material";
import { formatTokenAmountToHumanReadable } from "helpers/TokenUltis";
import SuiBox from "components/SuiBox";
import SuiButton from "components/SuiButton";
import { Facebook, FiberManualRecord, GitHub, Language, Twitter } from "@mui/icons-material";
import SuiTypography from "components/SuiTypography";
import { observer } from "mobx-react";
import humanize from "humanize";
import "./TokenSalesItem.scss";

const TokenSalesItem = (props) => {
  const { token } = props;
  const tokenData = token[1];
  useEffect(() => {}, []);
  return (
    <Card className="token-sales-item">
      {tokenData ? (
        <SuiBox p={2}>
          <SuiBox p={2} sx={{ textAlign: "right" }}>
            {/* <SuiButton variant="gradient" disabled sx={{ marginRight: 1 }} color="primary">
              <Check />
            </SuiButton> */}
            <SuiButton variant="gradient" disabled color="primary">
              <FiberManualRecord color="warning" /> {tokenData.tokenPeriod}
            </SuiButton>
          </SuiBox>
          <SuiBox p={2}>
            <SuiTypography component="label" variant="h5" fontWeight="bold">
              <Avatar src={tokenData.tokenInfo.icon} sx={{ float: "left", mr: "1rem" }} />{" "}
              {`${tokenData.tokenInfo.name} (${tokenData.tokenInfo.symbol})`}
            </SuiTypography>
            <Box className="slider-container">
              <Slider
                className="slider-total"
                min={0}
                max={tokenData.totalDeposit.formatted_amount}
                value={[0, tokenData.totalDeposit.formatted_amount]}
                // defaultValue={tokenData.totalDeposit.formatted_amount}
                disabled
                marks={[
                  // {
                  //   value: tokenData.totalDeposit.min || 0,
                  //   label: (
                  //     <Box sx={{ ml: "5rem" }}>
                  //       <SuiTypography component="p" variant="caption" fontWeight="bold">
                  //         Min raise
                  //       </SuiTypography>
                  //       <SuiTypography component="p" variant="h5" fontWeight="bold">
                  //         ${tokenData.totalDeposit.min || 0} NEAR
                  //       </SuiTypography>
                  //     </Box>
                  //   ),
                  // },
                  // {
                  //   value: token.max,
                  //   label: (
                  //     <Box sx={{ mr: "5rem" }}>
                  //       <SuiTypography component="p" variant="caption" fontWeight="bold">
                  //         Max raise
                  //       </SuiTypography>
                  //       <SuiTypography component="p" variant="h5" fontWeight="bold">
                  //         ${token.max} NEAR
                  //       </SuiTypography>
                  //     </Box>
                  //   ),
                  // },
                  {
                    value: tokenData.totalDeposit.formatted_amount,
                    label: (
                      <Box sx={{ mt: "-4rem", ml: "5rem" }}>
                        <SuiTypography component="p" variant="caption" fontWeight="bold">
                          Total raise
                        </SuiTypography>
                        <SuiTypography component="p" variant="h6" fontWeight="bold">
                          ${tokenData.totalDeposit.formatted_amount} NEAR
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
                Token Price:
              </SuiTypography>
              <SuiTypography component="p" variant="h5" fontWeight="bold" color="primary">
                {humanize.numberFormat(
                  tokenData.totalDeposit.formatted_amount /
                    formatTokenAmountToHumanReadable(
                      tokenData.saleInfo.num_of_tokens.toString(),
                      tokenData.tokenInfo.decimals
                    ),
                  tokenData.tokenInfo.decimals
                )}
              </SuiTypography>
            </Box>
          </SuiBox>
          {/* <SuiBox pl={2} pr={2}>
          <SuiTypography component="label" variant="caption" fontWeight="bold">
            Auction Type:
          </SuiTypography>
          <SuiTypography component="p" variant="h5" fontWeight="bold" color="primary">
            {token.saleType}
          </SuiTypography>
        </SuiBox> */}
          {tokenData.refData && (
            <>
              {tokenData.refData.description && (
                <SuiBox pl={2} pr={2}>
                  <SuiTypography component="label" variant="caption" fontWeight="bold">
                    Description:
                  </SuiTypography>
                  <SuiTypography component="p" variant="h5" fontWeight="bold" color="primary">
                    {tokenData.refData.description}
                  </SuiTypography>
                </SuiBox>
              )}
              {Object.keys(tokenData.refData).length > 1 && (
                <SuiBox pl={2} pr={2}>
                  <SuiTypography component="label" variant="caption" fontWeight="bold">
                    Social Channels:
                  </SuiTypography>
                  <SuiTypography component="p">
                    {Object.keys(tokenData.refData).map((key) => (
                      <Link
                        href={tokenData.refData[key]}
                        underline="none"
                        target="_blank"
                        rel="noopener"
                      >
                        {key === "website" && (
                          <Language sx={{ mr: "5px", ":hover": { color: "purple" } }} />
                        )}
                        {key === "github" && (
                          <GitHub sx={{ mr: "5px", ":hover": { color: "purple" } }} />
                        )}
                        {key === "facebook" && (
                          <Facebook sx={{ mr: "5px", ":hover": { color: "purple" } }} />
                        )}
                        {key === "twitter" && (
                          <Twitter sx={{ mr: "5px", ":hover": { color: "purple" } }} />
                        )}
                      </Link>
                    ))}
                  </SuiTypography>
                </SuiBox>
              )}
            </>
          )}
        </SuiBox>
      ) : (
        <Skeleton variant="rectangular" width={210} height={118} />
      )}
    </Card>
  );
};
export default observer(TokenSalesItem);
