import { Table } from "@mui/material";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";

const AllocationTable = (props) => {
  const { allocation, onChange, isHideAccountId, tokenStore, loading } = props;
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
      allocatedPercent: <>item.allocatedPercent</>,
      initialRelease: <>item.initialRelease</>,
      vestingStartTime: <>item.vestingStartTime</>,
      vestingEndTime: <>item.vestingEndTime</>,
      vestingInterval: <>item.vestingInterval</>,
    }));
    setAllocationRows(lst);
  };

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
