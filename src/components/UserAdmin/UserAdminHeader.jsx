import { Box, Button, Typography } from "@mui/material";
// ~~~~~~~~~~ Hooks ~~~~~~~~~~ //
import { flexRowSpace } from "../Utils/pageStyles";
// ~~~~~~~~~~ Components ~~~~~~~~~~ //
import SearchBar from "../SearchBar/SearchBar";
import RegisterModal from "./RegisterModal";

export default function ({
  query,
  onChange,
  clearInput,
  pageHeaderStyle,
  isModalOpen,
  handleOpenModal,
  handleCloseModal,
}) {
  return (
    <>
      <Typography variant="h6" sx={pageHeaderStyle}>
        User Administration
      </Typography>
      <Box sx={{ ...flexRowSpace, mb: 1 }}>
        <SearchBar
          isOrganization={false}
          isCoupon={false}
          isUserAdmin={true}
          query={query}
          onChange={onChange}
          clearInput={clearInput}
        />
        <Button variant="contained" onClick={handleOpenModal}>
          Register a new user
        </Button>
        <RegisterModal open={isModalOpen} onClose={handleCloseModal} />
      </Box>
    </>
  );
}
