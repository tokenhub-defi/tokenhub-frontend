import { useContext, useEffect, useState } from "react";
import SuiBox from "components/SuiBox";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import TokenNavbar from "components/App/TokenNavbar";
import { observer } from "mobx-react";
import { Card, Grid, Pagination, Skeleton } from "@mui/material";
import { ListTokenSalesContext } from "layouts/listtokensales/context/ListTokenSalesContext";
import { Link, useLocation } from "react-router-dom";
import TokenSalesItem from "../TokenSalesItem";

const ListTokenSalesContainer = () => {
  const location = useLocation();
  const { salesContractStore, tokenStore } = useContext(ListTokenSalesContext);
  const [tokens, setTokens] = useState([]);
  const [fromIndex, setFromIndex] = useState(0);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const limit = 10;

  const handleGetData = async (pathName) => {
    try {
      setLoading(true);
      const value = await salesContractStore.getCampaigns(fromIndex, limit);
      if (value) {
        setTotal(value.total);
        if (pathName) {
          switch (pathName) {
            case "upcoming-sales":
              value.result = value.result.filter((r) => r[1].tokenPeriod === "NOT_STARTED");
              break;
            case "past-sales":
              value.result = value.result.filter((r) => r[1].tokenPeriod === "FINISHED");
              break;
            default:
              value.result = value.result.filter(
                (r) => r[1].tokenPeriod !== "NOT_STARTED" && r[1].tokenPeriod !== "FINISHED"
              );
              break;
          }
        }
        setTokens(value.result);
      }
    } catch (error) {
      console.error("Init Sales Contract: ", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    // const tempData = [
    //   {
    //     status: "FINISHED",
    //     name: "DotOracle",
    //     symbol: "DTO",
    //     min: 50,
    //     max: 3000,
    //     total: 2500,
    //     price: "0.5",
    //     saleType: "CrowdSale",
    //   },
    //   {
    //     status: "FINISHED",
    //     name: "DotOracle",
    //     symbol: "DTO",
    //     min: 50,
    //     max: 3000,
    //     total: 2500,
    //     price: "0.5",
    //     saleType: "CrowdSale",
    //   },
    //   {
    //     status: "FINISHED",
    //     name: "DotOracle",
    //     symbol: "DTO",
    //     min: 50,
    //     max: 3000,
    //     total: 2500,
    //     price: "0.5",
    //     saleType: "CrowdSale",
    //   },
    //   {
    //     status: "FINISHED",
    //     name: "DotOracle",
    //     symbol: "DTO",
    //     min: 50,
    //     max: 3000,
    //     total: 2500,
    //     price: "0.5",
    //     saleType: "CrowdSale",
    //   },
    //   {
    //     status: "FINISHED",
    //     name: "DotOracle",
    //     symbol: "DTO",
    //     min: 50,
    //     max: 3000,
    //     total: 2500,
    //     price: "0.5",
    //     saleType: "CrowdSale",
    //   },
    //   {
    //     status: "FINISHED",
    //     name: "Ethernaal",
    //     symbol: "NAAL",
    //     min: 5,
    //     max: 300,
    //     total: 200,
    //     price: "0.5",
    //     saleType: "CrowdSale",
    //   },
    // ];
    // setTokens(tempData);
    const init = async () => {
      await salesContractStore.initSalesContract();
    };
    if (tokenStore.accountId) init();
  }, [tokenStore.accountId]);

  useEffect(() => {
    const paths = location.pathname.split("/");
    const pathName = paths[paths.length - 1];
    handleGetData(pathName);
  }, [fromIndex]);

  const onItemClick = () => {};

  const onPageChange = (page) => {
    setFromIndex(page * limit - 1);
  };
  const renderLoadingSkeleton = () => {
    const views = [];
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < limit; i++) {
      views.push(
        <Grid key={new Date().getTime() + i} item xs={2} sm={4} md={4}>
          <Card>
            <Skeleton variant="rectangular" height={400} />
          </Card>
        </Grid>
      );
    }
    return views;
  };

  return (
    <DashboardLayout>
      <TokenNavbar />
      {loading ? (
        <SuiBox py={3}>
          <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
            {renderLoadingSkeleton()}
          </Grid>
        </SuiBox>
      ) : (
        <SuiBox py={3}>
          <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
            {tokens.map((token) => (
              <Grid key={new Date().getTime() + token[0]} item xs={2} sm={4} md={4}>
                <Link to={`/token-sales/token-info/${token[0]}`}>
                  <TokenSalesItem token={token} onClick={onItemClick} />
                </Link>
              </Grid>
            ))}
          </Grid>
          {total > limit && (
            <Pagination
              count={total}
              variant="outlined"
              color="primary"
              onChange={onPageChange}
              disabled={loading}
            />
          )}
        </SuiBox>
      )}
    </DashboardLayout>
  );
};
export default observer(ListTokenSalesContainer);
