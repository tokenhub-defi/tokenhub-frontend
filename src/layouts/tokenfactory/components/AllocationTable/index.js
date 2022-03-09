/* eslint-disable no-unused-vars */
import SuiInput from "components/SuiInput";
import { MenuItem, Select, TextField } from "@mui/material";
import {
  DataGrid,
  GridActionsCellItem,
  GridToolbarColumnsButton,
  GridToolbarContainer,
} from "@mui/x-data-grid";
import PropTypes from "prop-types";
import { observer } from "mobx-react";
import _ from "lodash";
import { DateTimePicker, LocalizationProvider } from "@mui/lab";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import { TREASURY_ACCOUNT } from "layouts/tokenfactory/stores/TokenFactory.store";
import SuiBox from "components/SuiBox";
import SuiButton from "components/SuiButton";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import "../Allocation/allocation.scss";
import { useCallback } from "react";
import Button from "assets/theme/components/button";

const AllocationTable = (props) => {
  const { onChange, loading, allocations, isResume, accountId } = props;

  const updateAllocation = ({ id, field, value }) => {
    onChange(allocations.map((all) => (all.id === id ? { ...all, ...{ [field]: value } } : all)));
  };
  const checkChangeable = (account) => account !== TREASURY_ACCOUNT && account !== accountId;

  return (
    <DataGrid
      autoHeight
      onCellEditCommit={(params) => {
        console.log(params);
        updateAllocation(params);
      }}
      isCellEditable={(params) =>
        (params.colDef.field !== "accountId" && !loading) ||
        (params.colDef.field === "accountId" && checkChangeable(params.row.accountId) && !loading)
      }
      disableColumnMenu
      columns={[
        {
          headerName: "Account",
          field: "accountId",
          editable: !loading,
          flex: 2,
          headerAlign: "left",
        },
        {
          headerName: "Allocated",
          field: "allocatedPercent",
          editable: !loading,
          flex: 1,
          type: "number",
          headerAlign: "right",
          valueFormatter: (params) => `${params.value} %`,
        },
        {
          headerName: "Initial Release",
          flex: 1,
          field: "initialRelease",
          editable: !loading,
          type: "number",
          headerAlign: "right",
          valueFormatter: (params) => `${params.value} %`,
        },
        {
          headerName: "Start Time",
          flex: 1,
          field: "vestingStartTime",
          editable: !loading,
          type: "date",
          headerAlign: "right",
          align: "right",
        },
        {
          headerName: "Duration",
          flex: 1,
          field: "vestingDuration",
          editable: !loading,
          type: "singleSelect",
          valueOptions: [4],
          align: "right",
          headerAlign: "right",
          valueFormatter: (params) => `${params.value} day`,
        },
        {
          headerName: "Interval",
          flex: 1,
          field: "vestingInterval",
          valueOptions: [1],
          editable: !loading,
          type: "singleSelect",
          align: "right",
          headerAlign: "right",
          valueFormatter: (params) => `${params.value} day`,
        },
        {
          field: "actions",
          type: "actions",
          headerName: "",
          flex: 1,
          cellClassName: "actions",
          getActions: (e) =>
            checkChangeable(e.row.accountId)
              ? [
                  <GridActionsCellItem
                    icon={<DeleteRoundedIcon />}
                    label="Delete"
                    disabled={loading || !checkChangeable()}
                    onClick={() => {
                      onChange(allocations.filter((al) => al.id !== e.id));
                    }}
                    color="error"
                  />,
                ]
              : [],
        },
      ]}
      rows={allocations}
      hideFooter
    />
  );
};

AllocationTable.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  allocations: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  isResume: PropTypes.bool,
  accountId: PropTypes.string,
};

AllocationTable.defaultProps = {
  loading: false,
  isResume: false,
  accountId: null,
};

export default observer(AllocationTable);
