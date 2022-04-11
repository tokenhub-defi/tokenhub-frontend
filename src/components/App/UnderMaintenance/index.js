import maintenance from "assets/images/maintenance-min.png";
import { observer } from "mobx-react";
import SuiBox from "components/SuiBox";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";

const UnderMaintenance = () => <DashboardLayout>
    <SuiBox component="img"
        src={maintenance} width="100%" />
</DashboardLayout>

export default observer(UnderMaintenance);