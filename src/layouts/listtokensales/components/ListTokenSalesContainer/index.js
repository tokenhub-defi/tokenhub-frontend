import { useEffect, useState } from "react";
import SuiBox from "components/SuiBox";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import TokenNavbar from "components/App/TokenNavbar";
import { observer } from "mobx-react";
import { Grid } from "@mui/material";
import TokenSalesItem from "../TokenSalesItem";

const ListTokenSalesContainer = () => {
  const [tokens, setTokens] = useState([]);

  useEffect(() => {
    const tempData = [
      {
        status: "FINISHED",
        name: "DotOracle",
        symbol: "DTO",
        min: "50",
        max: "3000",
        total: "2500",
        price: "0.5",
        saleType: "CrowdSale",
      },
      {
        status: "FINISHED",
        name: "DotOracle",
        symbol: "DTO",
        min: "50",
        max: "3000",
        total: "2500",
        price: "0.5",
        saleType: "CrowdSale",
      },
      {
        status: "FINISHED",
        name: "DotOracle",
        symbol: "DTO",
        min: "50",
        max: "3000",
        total: "2500",
        price: "0.5",
        saleType: "CrowdSale",
      },
      {
        status: "FINISHED",
        name: "DotOracle",
        symbol: "DTO",
        min: "50",
        max: "3000",
        total: "2500",
        price: "0.5",
        saleType: "CrowdSale",
      },
      {
        status: "FINISHED",
        name: "DotOracle",
        symbol: "DTO",
        min: "50",
        max: "3000",
        total: "2500",
        price: "0.5",
        saleType: "CrowdSale",
      },
      {
        status: "FINISHED",
        name: "Ethernaal",
        symbol: "NAAL",
        min: "5",
        max: "300",
        total: "200",
        price: "0.5",
        saleType: "CrowdSale",
      },
    ];
    setTokens(tempData);
  }, []);

  const onItemClick = () => {};

  return (
    <DashboardLayout>
      <TokenNavbar />
      <SuiBox py={3}>
        <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
          {tokens.map((token) => (
            <Grid item xs={2} sm={4} md={4}>
              <TokenSalesItem token={token} onClick={onItemClick} />
            </Grid>
          ))}
        </Grid>
      </SuiBox>
    </DashboardLayout>
  );
};
export default observer(ListTokenSalesContainer);
