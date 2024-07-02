import * as React from "react";
import { styled } from "@mui/material/styles";
import { Box, SpeedDial, SpeedDialAction } from "@mui/material";
// ~~~~~~~~~~~ Icons ~~~~~~~~~~~~~~~~~~~~ //
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import MenuIcon from "@mui/icons-material/Menu";
import { showDeleteSweetAlert } from "../Utils/sweetAlerts";
import { border } from "../Utils/colors";

const StyledSpeedDial = styled(SpeedDial)(({ theme }) => ({
  // position: "absolute",
  // top: 0,
  // right: 0,
  "&.MuiSpeedDial-directionUp, &.MuiSpeedDial-directionLeft": {
    bottom: theme.spacing(2),
    right: theme.spacing(2),
  },
  "&.MuiSpeedDial-directionDown, &.MuiSpeedDial-directionRight": {
    top: theme.spacing(2),
    left: theme.spacing(2),
  },
  // Custom styles to make the SpeedDial smaller
  "& .MuiSpeedDial-fab": {
    width: "36px",
    height: "36px",
  },
  "& .MuiSvgIcon-root": {
    fontSize: "25px", // Adjust the icon size
  },
}));

const actions = [
  { icon: <EditIcon />, name: "Edit" },
  { icon: <DeleteIcon />, name: "Delete" },
];

export default function ActionsSpeedDial({
  handleDelete,
  handleEdit,
  handleOpenModal,
  location,
  toggleEdit,
}) {
  const [direction, setDirection] = React.useState("left");
  const [hidden, setHidden] = React.useState(false);

  const deleteClick = () => {
    showDeleteSweetAlert(() => {
      handleDelete(location.id, location.merchant_id);
    }, "removeLocation");
  };

  const editClick = () => {
    handleEdit(location.id, location.merchant_id);
    toggleEdit(location);
    handleOpenModal();
  };

  return (
    <Box>
      <Box sx={{ position: "relative" }}>
        <StyledSpeedDial
          ariaLabel="SpeedDial for edit and delete actions"
          hidden={hidden}
          icon={<MenuIcon />}
          direction={direction}
        >
          {actions.map((action) => (
            <SpeedDialAction
              key={action.name}
              icon={action.icon}
              tooltipTitle={action.name}
              onClick={
                action.name === "Delete"
                  ? deleteClick
                  : action.name === "Edit"
                  ? editClick
                  : null
              }
            />
          ))}
        </StyledSpeedDial>
      </Box>
    </Box>
  );
}
