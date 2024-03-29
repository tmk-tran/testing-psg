import React, { useEffect } from "react";
import { Grid, Typography } from "@mui/material";
import { allYears } from "../../hooks/reduxStore";
import { dispatchHook } from "../../hooks/useDispatch";

export default function AvailableYears() {
  const dispatch = dispatchHook();
  useEffect(() => {
    const dispatchAction = {
      type: "FETCH_COUPON_BOOKS",
    };
    console.log(dispatchAction);
    dispatch(dispatchAction);
  }, []);
  const years = allYears();
  
  return (
    <Grid container direction="column" alignItems="center">
      <Grid item xs={12}>
        <Typography sx={{ textAlign: "center" }}>
          Available years:
        </Typography>
      </Grid>
      {years.map((yearObj) => (
        <Grid item xs={12} key={yearObj.id}>
          <Typography sx={{ textAlign: "center" }}>
            {yearObj.year}
          </Typography>
        </Grid>
      ))}
    </Grid>
  );
}
