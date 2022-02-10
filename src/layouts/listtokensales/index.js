import ListTokenSalesContainer from "./components/ListTokenSalesContainer";
import { ListTokenSalesProvider } from "./context/ListTokenSalesContext";

export default function ListTokenSales() {
  return (
    <ListTokenSalesProvider>
      <ListTokenSalesContainer />
    </ListTokenSalesProvider>
  );
}
