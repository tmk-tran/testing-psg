import React, { useState, useEffect } from "react";
import {
  Box,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  Pagination,
  Tooltip,
} from "@mui/material";
// ~~~~~~~~~~ Hooks ~~~~~~~~~~ //
import { dispatchHook } from "../../hooks/useDispatch";
import { allYears } from "../../hooks/reduxStore";
import { centeredStyle } from "../Utils/pageStyles";
import ConfirmNewYearModal from "./ConfirmNewYearModal";
import { highlightColor } from "../Utils/colors";

const AvailableYearsButtons = ({ activeYear }) => {
  const dispatch = dispatchHook();
  const [yearSelected, setYearSelected] = useState(null);
  const [selectedYearId, setSelectedYearId] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const dispatchAction = {
      type: "FETCH_COUPON_BOOKS",
    };
    dispatch(dispatchAction);
  }, []);
  const years = allYears();

  const handleChange = (event, year) => {
    setSelectedYearId(year.id);
    setYearSelected(year.year);
    setModalOpen(true);
  };

  const itemsPerPage = 5;
  const [page, setPage] = useState(1);

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const startIdx = (page - 1) * itemsPerPage;
  const endIdx = startIdx + itemsPerPage;
  const displayedYears = years.slice(startIdx, endIdx);

  return (
    <>
      <ConfirmNewYearModal
        selectedYearId={selectedYearId}
        yearSelected={yearSelected}
        setYearSelected={setYearSelected}
        modalOpen={modalOpen}
        setModalOpen={setModalOpen}
      />
      <Typography sx={{ textAlign: "center", mt: 1, mb: 2 }}>
        Select Active Book Year:{" "}
      </Typography>
      <Box sx={centeredStyle}>
        <ToggleButtonGroup
          value={selectedYearId}
          exclusive
          onChange={handleChange}
          orientation="vertical"
        >
          {displayedYears.map((year) => (
            <Tooltip key={year.id} title="Sets Active Year for App">
              <ToggleButton
                key={year.id}
                value={year}
                style={
                  year.year === activeYear
                    ? { ...highlightColor, color: "black" }
                    : null
                }
              >
                {year.year}
              </ToggleButton>
            </Tooltip>
          ))}
        </ToggleButtonGroup>
        <br />
        <Pagination
          count={Math.ceil(years.length / itemsPerPage)}
          page={page}
          onChange={handlePageChange}
          color="primary"
        />
      </Box>
    </>
  );
};

export default AvailableYearsButtons;
