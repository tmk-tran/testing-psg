import { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import { Search, Clear } from "@mui/icons-material";

const SearchBar = ({
  isMobile,
  isOrganization,
  isCoupon,
  isUserAdmin,
  query,
  onChange,
  clearInput,
  disabled,
}) => {
  const [isSticky, setIsSticky] = useState(false);

  const stickyStyle = {
    position: isSticky ? "fixed" : "static",
    top: 10,
    left: 0,
    right: 0,
    margin: "auto",
    width: "100%",
    zIndex: 1,
    paddingTop: 15,
    backgroundColor: "white",
  };

  useEffect(() => {
    if (isMobile) {
      const handleScroll = () => {
        if (window.scrollY > 0) {
          setIsSticky(true);
        } else {
          setIsSticky(false);
        }
      };

      window.addEventListener("scroll", handleScroll);
      return () => {
        window.removeEventListener("scroll", handleScroll);
      };
    }
  }, [isMobile]);

  const handleChange = (event) => {
    const { value } = event.target;
    onChange(value);
  };

  const handleClearSearch = () => {
    clearInput();
  };

  return (
    <div style={isMobile ? stickyStyle : {}}>
      {isUserAdmin && !isOrganization && !isCoupon && (
        <TextField
          label="Search by Last Name"
          variant="outlined"
          size="small"
          value={query}
          onChange={handleChange}
          InputProps={{
            startAdornment: (
              <Search
                color="primary"
                fontSize="small"
                style={{ marginRight: 16 }}
              />
            ),
            endAdornment: query && (
              <Clear
                color="action"
                fontSize="small"
                onClick={handleClearSearch}
                style={{ cursor: "pointer" }}
              />
            ),
          }}
        />
      )}
      {!isUserAdmin && (
        <>
          {isOrganization && !isCoupon ? (
            <TextField
              label="Search Organizations"
              variant="outlined"
              size="small"
              value={query}
              onChange={handleChange}
              InputProps={{
                startAdornment: (
                  <Search
                    color="primary"
                    fontSize="small"
                    style={{ marginRight: 16 }}
                  />
                ),
                endAdornment: query && (
                  <Clear
                    color="action"
                    fontSize="small"
                    onClick={handleClearSearch}
                    style={{ cursor: "pointer" }}
                  />
                ),
              }}
            />
          ) : (
            <TextField
              label={isCoupon ? "Search by Merchant" : "Search Merchants"}
              variant="outlined"
              size="small"
              value={query}
              onChange={handleChange}
              fullWidth={isMobile}
              InputProps={{
                startAdornment: (
                  <Search
                    color={!disabled ? "primary" : "disabled"}
                    fontSize="small"
                    style={{ marginRight: 16 }}
                  />
                ),
                endAdornment: query && (
                  <Clear
                    color="action"
                    fontSize="small"
                    onClick={handleClearSearch}
                    style={{ cursor: "pointer" }}
                  />
                ),
              }}
              disabled={disabled}
            />
          )}
        </>
      )}
    </div>
  );
};

export default SearchBar;
