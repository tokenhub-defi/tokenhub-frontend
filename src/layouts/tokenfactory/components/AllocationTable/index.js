import SuiInput from "components/SuiInput";
import { MenuItem, Select, TextField } from "@mui/material";
import Table from "examples/Tables/Table";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { observer } from "mobx-react";
import _ from "lodash";
import { DateTimePicker, LocalizationProvider } from "@mui/lab";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import { TREASURY_ACCOUNT } from "layouts/tokenfactory/stores/TokenFactory.store";
import SuiBox from "components/SuiBox";
import SuiButton from "components/SuiButton";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import "../Allocation/allocation.scss";

const AllocationTable = (props) => {
  const { onChange, loading, allocations, isResume, accountId } = props;
  const [rows, setRows] = useState([]);

  const updateAllocation = (allocation) => {
    const alRows = [...allocations];
    const index = alRows.findIndex((ar) => ar.id === allocation.id);
    if (index > -1) {
      alRows[index] = allocation;
      onChange(alRows);
    }
  };

  const buildAllocationRow = () => {
    const lst = allocations.map((item) => ({
      accountId: (
        <SuiInput
          value={item.accountId}
          disabled={loading}
          onChange={(e) => {
            const allocation = { ...item };
            allocation.accountId = e.target.value;
            updateAllocation(allocation);
          }}
          sx={
            _.isEmpty(item.accountId) && !isResume
              ? { borderColor: "red" }
              : { borderColor: "inherited" }
          }
        />
      ),
      allocatedPercent: (
        <TextField
          value={item.allocatedPercent}
          disabled={loading}
          type="number"
          className="allocated-percent"
          inputProps={{
            max: 100,
            min: 10,
            width: "100%",
          }}
          sx={{ width: "100%" }}
          onChange={(e) => {
            const allocation = { ...item };
            allocation.allocatedPercent = e.target.value;
            updateAllocation(allocation);
          }}
        />
      ),
      initialRelease: (
        <TextField
          value={item.initialRelease}
          disabled={loading}
          type="number"
          className="initial-release"
          inputProps={{
            max: 100,
            min: 10,
            width: "100%",
          }}
          sx={{ width: "100%" }}
          onChange={(e) => {
            const allocation = { ...item };
            allocation.initialRelease = e.target.value;
            updateAllocation(allocation);
          }}
        />
      ),
      vestingStartTime: (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DateTimePicker
            renderInput={(params) => <TextField {...params} disabled={loading} />}
            disabled={loading}
            onChange={(value) => {
              const allocation = { ...item };
              allocation.vestingStartTime = value;
              updateAllocation(allocation);
            }}
            value={item.vestingStartTime}
          />
        </LocalizationProvider>
      ),
      vestingDuration: (
        <Select
          value={item.vestingDuration}
          disabled={loading}
          onChange={(e) => {
            const allocation = { ...item };
            allocation.vestingDuration = e.target.value;
            updateAllocation(allocation);
          }}
          input={<SuiInput />}
        >
          {/* <MenuItem value={1}>1</MenuItem> */}
          <MenuItem value={4}>4</MenuItem>
          {/* <MenuItem value={7}>7</MenuItem>
          <MenuItem value={30}>30</MenuItem> */}
        </Select>
      ),
      vestingInterval: (
        <Select
          value={item.vestingInterval}
          disabled={loading}
          onChange={(e) => {
            const allocation = { ...item };
            allocation.vestingInterval = e.target.value;
            updateAllocation(allocation);
          }}
          input={<SuiInput />}
        >
          <MenuItem value={1}>1</MenuItem>
          {/* <MenuItem value={7}>7</MenuItem> */}
        </Select>
      ),
      action: (
        <>
          {item.accountId !== TREASURY_ACCOUNT && item.accountId !== accountId && (
            <SuiBox sx={{ textAlign: "center" }}>
              <SuiButton
                disabled={loading}
                color="error"
                variant="outlined"
                onClick={() => {
                  const allList = allocations.filter((al) => al.id !== item.id);
                  onChange(allList);
                }}
              >
                <DeleteRoundedIcon />
              </SuiButton>
            </SuiBox>
          )}
        </>
      ),
    }));
    setRows(lst);
  };

  useEffect(() => {
    buildAllocationRow();
  }, [allocations]);

  return (
    <Table
      columns={[
        { title: "Account", name: "accountId", align: "left" },
        { title: "Allocated Percent", name: "allocatedPercent", align: "right" },
        { title: "Initial Release", name: "initialRelease", align: "right" },
        { title: "Start Time", name: "vestingStartTime", align: "right" },
        { title: "Duration", name: "vestingDuration", align: "right" },
        { title: "Interval", name: "vestingInterval", align: "right" },
        { title: "", name: "action", align: "center" },
      ]}
      rows={rows}
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
