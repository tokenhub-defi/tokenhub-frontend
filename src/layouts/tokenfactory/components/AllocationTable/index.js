import SuiInput from "components/SuiInput";
import { Table } from "@mui/material";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";

const AllocationTable = (props) => {
  const { allocation, onChange, loading, token } = props;
  const { allocationList } = token;
  const { allocationRows, setAllocationRows } = useState([]);

  const buildAllocationRow = () => {
    const lst = token.allocationList.map((item) => ({
      accountId: (
        <SuiInput
          value={accountId}
          disabled={loading}
          onChange={(e) => {
            setAccountId(e.target.value);
          }}
          sx={_.isEmpty(accountId) ? { borderColor: "red" } : { borderColor: "inherited" }}
        />
      ),
      allocatedPercent: (
        <TextField
          value={allocatedPercent}
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
            setAllocatedPercent(e.target.value);
          }}
        />
      ),
      initialRelease: (
        <TextField
          value={initialRelease}
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
            setInitialRelease(e.target.value);
          }}
        />
      ),
      vestingStartTime: (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DateTimePicker
            renderInput={(params) => <TextField {...params} disabled={loading} />}
            disabled={loading}
            onChange={(value) => {
              setVestingStartTime(value);
            }}
            value={vestingStartTime}
          />
        </LocalizationProvider>
      ),
      vestingEndTime: (
        <Select
          value={vestingDuration}
          disabled={loading}
          onChange={(e) => {
            setVestingDuration(e.target.value);
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
          value={vestingInterval}
          disabled={loading}
          onChange={(e) => {
            setVestingInterval(e.target.value);
          }}
          input={<SuiInput />}
        >
          <MenuItem value={1}>1</MenuItem>
          {/* <MenuItem value={7}>7</MenuItem> */}
        </Select>
      ),
    }));
    setAllocationRows(lst);
  };

  useEffect(() => {}, []);

  useEffect(() => {
    onChange({
      ...allocation,
      ...{
        accountId,
        allocatedPercent,
        initialRelease,
        vestingStartTime,
        vestingDuration,
        vestingInterval,
      },
    });
  }, [
    accountId,
    allocatedPercent,
    initialRelease,
    vestingStartTime,
    vestingDuration,
    vestingInterval,
  ]);

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
      rows={allocationRows}
    />
  );
};

AllocationTable.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  allocation: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  isHideAccountId: PropTypes.bool,
  // eslint-disable-next-line react/forbid-prop-types
  tokenStore: PropTypes.object,
  loading: PropTypes.bool,
};

AllocationTable.defaultProps = {
  isHideAccountId: false,
  tokenStore: null,
  loading: false,
};

export default AllocationTable;
