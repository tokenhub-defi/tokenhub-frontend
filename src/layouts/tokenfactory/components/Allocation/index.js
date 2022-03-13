import { Grid, TextField } from "@mui/material";
import { DateTimePicker, LocalizationProvider } from "@mui/lab";
import SuiBox from "components/SuiBox";
import SuiInput from "components/SuiInput";
import SuiTypography from "components/SuiTypography";
import { useEffect, useState } from "react";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import PropTypes from "prop-types";
import { TREASURY_ACCOUNT } from "layouts/tokenfactory/stores/TokenFactory.store";
import _ from "lodash";

const AllocationView = (props) => {
  const { allocation, onChange, isHideAccountId, tokenStore, loading } = props;
  const [accountId, setAccountId] = useState(allocation.accountId);
  const [allocatedPercent, setAllocatedPercent] = useState(allocation.allocatedPercent);
  const [initialRelease, setInitialRelease] = useState(allocation.initialRelease);
  const [vestingStartTime, setVestingStartTime] = useState(allocation.vestingStartTime);
  const [vestingDuration, setVestingDuration] = useState(allocation.vestingDuration);
  const [vestingInterval, setVestingInterval] = useState(allocation.vestingInterval);
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
    <SuiBox component="form" role="form">
      {!isHideAccountId && (
        <SuiBox mb={2}>
          <SuiBox mb={1} ml={0.5}>
            <Grid container direction="row" justifyContent="space-between" sx={{ pt: 1 }}>
              <SuiTypography component="label" variant="caption" fontWeight="bold" mb={1}>
                Account {accountId === TREASURY_ACCOUNT && "Treasury"}{" "}
                {accountId === tokenStore.accountId && "Creator"}
              </SuiTypography>
              {_.isEmpty(accountId) && (
                <SuiTypography
                  component="label"
                  variant="caption"
                  fontWeight="bold"
                  sx={{ color: "red" }}
                >
                  Please enter the account id!!
                </SuiTypography>
              )}
            </Grid>
          </SuiBox>
          {accountId !== TREASURY_ACCOUNT && accountId !== tokenStore.accountId && (
            <SuiInput
              value={accountId}
              disabled={loading}
              onChange={(e) => {
                setAccountId(e.target.value);
              }}
              sx={_.isEmpty(accountId) ? { borderColor: "red" } : { borderColor: "inherited" }}
            />
          )}
        </SuiBox>
      )}
      <Grid container spacing={1}>
        <Grid item xs={12} md={6}>
          <SuiBox mb={2}>
            <SuiBox mb={1} ml={0.5}>
              <SuiTypography component="label" variant="caption" fontWeight="bold">
                Allocation (%)
              </SuiTypography>
            </SuiBox>
            {/* <Select
              value={allocatedPercent}
              onChange={(e) => {
                setAllocatedPercent(e.target.value);
              }}
              input={<SuiInput />}
            >
              <MenuItem value={15}>15%</MenuItem>
              <MenuItem value={20}>20%</MenuItem>
              <MenuItem value={25}>25%</MenuItem>
            </Select> */}
            <TextField
              value={allocatedPercent}
              disabled={loading}
              type="number"
              className="allocated-percent"
              inputProps={{
                max: 100,
                min: 10,
              }}
              fullWidth
              onChange={(e) => {
                let alPercent = e.target.value;
                if (alPercent < parseInt(e.target.min, 10)) alPercent = e.target.min;
                if (alPercent > parseInt(e.target.max, 10)) alPercent = e.target.max;
                setAllocatedPercent(parseFloat(alPercent).toFixed(2));
              }}
            />
          </SuiBox>
        </Grid>
        <Grid item xs={12} md={6}>
          <SuiBox mb={2}>
            <SuiBox mb={1} ml={0.5}>
              <SuiTypography component="label" variant="caption" fontWeight="bold">
                Initial Release (%)
              </SuiTypography>
            </SuiBox>
            {/* <Select
              value={initialRelease}
              onChange={(e) => {
                setInitialRelease(e.target.value);
              }}
              input={<SuiInput />}
            >
              <MenuItem value={8}>8%</MenuItem>
              <MenuItem value={10}>10%</MenuItem>
              <MenuItem value={15}>15%</MenuItem>
            </Select> */}
            {/* <SuiInput
              value={initialRelease}
              type="number"
              onChange={(e) => {
                setInitialRelease(e.target.value);
              }}
            /> */}
            <TextField
              value={initialRelease}
              disabled={loading}
              type="number"
              className="initial-release"
              inputProps={{
                max: 100,
                min: 1,
              }}
              fullWidth
              onChange={(e) => {
                let inRe = e.target.value;
                if (inRe < parseInt(e.target.min, 10)) inRe = e.target.min;
                if (inRe > parseInt(e.target.max, 10)) inRe = e.target.max;
                inRe = parseFloat(inRe, 10).toFixed(2);
                setInitialRelease(inRe);
              }}
            />
          </SuiBox>
        </Grid>
      </Grid>
      <SuiBox mb={2}>
        <SuiBox mb={1} ml={0.5}>
          <SuiTypography component="label" variant="caption" fontWeight="bold">
            Vesting Start Time
          </SuiTypography>
        </SuiBox>
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
      </SuiBox>
      <Grid container spacing={1}>
        <Grid item xs={12} md={6}>
          <SuiBox mb={2}>
            <SuiBox mb={1} ml={0.5}>
              <SuiTypography component="label" variant="caption" fontWeight="bold">
                Vesting Duration (days)
              </SuiTypography>
            </SuiBox>
            {/* <Select
              value={vestingDuration}
              disabled={loading}
              onChange={(e) => {
                setVestingDuration(e.target.value);
              }}
              input={<SuiInput />}
            >
              <MenuItem value={1}>1</MenuItem>
              <MenuItem value={4}>4</MenuItem>
              <MenuItem value={7}>7</MenuItem>
            <MenuItem value={30}>30</MenuItem>
            </Select> */}
            <TextField
              value={vestingDuration}
              disabled={loading}
              type="number"
              fullWidth
              onChange={(e) => {
                const durationT = e.target.value;
                setVestingDuration(durationT);
              }}
            />
          </SuiBox>
        </Grid>
        <Grid item xs={12} md={6}>
          <SuiBox mb={2}>
            <SuiBox mb={1} ml={0.5}>
              <SuiTypography component="label" variant="caption" fontWeight="bold">
                Vesting Interval (Days)
              </SuiTypography>
            </SuiBox>
            {/* <Select
              value={vestingInterval}
              disabled={loading}
              onChange={(e) => {
                setVestingInterval(e.target.value);
              }}
              input={<SuiInput />}
            >
              <MenuItem value={1}>1</MenuItem>
              <MenuItem value={7}>7</MenuItem>
            </Select> */}
            <TextField
              value={vestingInterval}
              disabled={loading}
              type="number"
              fullWidth
              onChange={(e) => {
                const intervalT = e.target.value;
                setVestingInterval(intervalT);
              }}
            />
          </SuiBox>
        </Grid>
      </Grid>
    </SuiBox>
  );
};
AllocationView.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  allocation: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  isHideAccountId: PropTypes.bool,
  // eslint-disable-next-line react/forbid-prop-types
  tokenStore: PropTypes.object,
  loading: PropTypes.bool,
};
AllocationView.defaultProps = {
  isHideAccountId: false,
  tokenStore: null,
  loading: false,
};
export default AllocationView;
