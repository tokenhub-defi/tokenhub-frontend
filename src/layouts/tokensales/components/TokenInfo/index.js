/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react/prop-types */
/* eslint-disable import/named */
import { Card, Grid, Skeleton, Typography } from "@mui/material";
import SuiBox from "components/SuiBox";
import { formatTokenAmountToHumanReadable } from "helpers/TokenUltis";
import { TokenSalesContext } from "layouts/tokensales/context/TokenSalesContext";
import { observer } from "mobx-react";
import { useContext, useEffect } from "react";
import wavesWhite from "assets/images/shapes/waves-white.svg";
import SuiTypography from "components/SuiTypography";
import PropTypes from "prop-types";
import humanize from "humanize";
import { ArrowRight, Facebook, GitHub, Language, Twitter } from "@mui/icons-material";

const TokenInfo = (props) => {
  const { tokenSalesStore } = useContext(TokenSalesContext);
  const { tokenContract } = tokenSalesStore;
  // eslint-disable-next-line react/prop-types
  const { reference } = props;
  useEffect(() => {
    console.log(tokenContract);
  }, []);

  return (
    <>
      {tokenContract?.tokenInfo ? (
        <Card>
          <SuiBox p={2}>
            <Grid container spacing={3}>
              <Grid item xs={12} lg={6}>
                <SuiBox display="flex" flexDirection="column" height="100%">
                  <Typography variant="h4" component="div" sx={{ mb: 1 }}>
                    Sale Information
                  </Typography>
                  <SuiTypography variant="h6" component="div">
                    <ArrowRight
                      fontSize="medium"
                      sx={{ verticalAlign: "middle" }}
                      color="primary"
                    />{" "}
                    Tokens for sale:{" "}
                    <SuiTypography variant="h6" component="span" color="primary">
                      {humanize.numberFormat(
                        formatTokenAmountToHumanReadable(
                          tokenContract.saleInfo.num_of_tokens.toString(),
                          tokenContract.tokenInfo.decimals
                        )
                      )}
                    </SuiTypography>
                  </SuiTypography>
                  <SuiTypography variant="h6" component="div">
                    <ArrowRight
                      fontSize="medium"
                      sx={{ verticalAlign: "middle" }}
                      color="primary"
                    />{" "}
                    Current period:{" "}
                    <SuiTypography variant="h6" component="span" color="primary">
                      {tokenContract.tokenPeriod}
                    </SuiTypography>
                  </SuiTypography>
                  <SuiTypography variant="h6" component="div">
                    <ArrowRight
                      fontSize="medium"
                      sx={{ verticalAlign: "middle" }}
                      color="primary"
                    />{" "}
                    Total deposit:{" "}
                    <SuiTypography variant="h6" component="span" color="primary">
                      {tokenContract.totalDeposit.formatted_amount}
                    </SuiTypography>
                  </SuiTypography>
                  <SuiTypography variant="h6" component="div">
                    <ArrowRight
                      fontSize="medium"
                      sx={{ verticalAlign: "middle" }}
                      color="primary"
                    />{" "}
                    Price:{" "}
                    <SuiTypography variant="h6" component="span" color="primary">
                      {humanize.numberFormat(
                        tokenContract.totalDeposit.formatted_amount /
                          formatTokenAmountToHumanReadable(
                            tokenContract.saleInfo.num_of_tokens.toString(),
                            tokenContract.tokenInfo.decimals
                          ),
                        6
                      )}
                    </SuiTypography>
                  </SuiTypography>
                </SuiBox>
              </Grid>
              <Grid item xs={12} lg={5} sx={{ position: "relative", ml: "auto" }}>
                <SuiBox
                  height="100%"
                  display="grid"
                  justifyContent="center"
                  alignItems="center"
                  bgColor="#ffb25a"
                  borderRadius="lg"
                >
                  <SuiBox
                    component="img"
                    src={wavesWhite}
                    alt="waves"
                    display="block"
                    position="absolute"
                    left={0}
                    width="100%"
                    height="100%"
                  />
                  {/* <SuiBox component="img" src={rocketWhite} alt="rocket" width="100%" pt={3} /> */}

                  <SuiTypography variant="h1" fontWeight="bold" color="white">
                    {reference?.logo_url != null && <img src={reference.logo_url} alt="logo" />}
                    {reference?.logo_url == null && tokenContract.tokenInfo.symbol}
                  </SuiTypography>
                </SuiBox>
              </Grid>
              <SuiBox pl={3}>
                <SuiTypography variant="h6" component="div">
                  <ArrowRight fontSize="medium" sx={{ verticalAlign: "middle" }} color="primary" />{" "}
                  Project description:{" "}
                  <SuiTypography
                    component="p"
                    variant="h6"
                    fontWeight="bold"
                    color="primary"
                    sx={{ textAlign: "justify" }}
                  >
                    <ArrowRight
                      fontSize="medium"
                      sx={{ verticalAlign: "middle", visibility: "hidden" }}
                      color="primary"
                    />{" "}
                    {reference.description}
                  </SuiTypography>
                </SuiTypography>
                <SuiTypography variant="h6" component="div">
                  <ArrowRight fontSize="medium" sx={{ verticalAlign: "middle" }} color="primary" />{" "}
                  Social Channels:{" "}
                  <SuiTypography component="p">
                    <ArrowRight
                      fontSize="medium"
                      sx={{ verticalAlign: "middle", visibility: "hidden" }}
                      color="primary"
                    />{" "}
                    {Object.keys(reference).map((key) => (
                      <>
                        {key === "website" && (
                          <a
                            href={reference[key]}
                            underline="none"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Language sx={{ mr: "5px", ":hover": { color: "primary" } }} />
                          </a>
                        )}
                        {key === "github" && (
                          <a
                            href={reference[key]}
                            underline="none"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <GitHub sx={{ mr: "5px", ":hover": { color: "primary" } }} />
                          </a>
                        )}
                        {key === "facebook" && (
                          <a
                            href={reference[key]}
                            underline="none"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Facebook sx={{ mr: "5px", ":hover": { color: "primary" } }} />
                          </a>
                        )}
                        {key === "twitter" && (
                          <a
                            href={reference[key]}
                            underline="none"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Twitter sx={{ mr: "5px", ":hover": { color: "primary" } }} />
                          </a>
                        )}
                      </>
                    ))}
                  </SuiTypography>
                </SuiTypography>
              </SuiBox>
            </Grid>
          </SuiBox>
        </Card>
      ) : (
        <SuiBox>
          <Skeleton variant="text" />
          <Skeleton variant="text" />
          <Skeleton variant="text" />
          <Skeleton variant="text" />
          <Skeleton variant="text" />
          <Skeleton variant="text" />
          <Skeleton variant="text" />
          <Skeleton variant="text" />
        </SuiBox>
      )}
    </>
  );
};
TokenInfo.propType = {
  reference: PropTypes.any,
};
TokenInfo.propDefault = {
  reference: null,
};
export default observer(TokenInfo);
