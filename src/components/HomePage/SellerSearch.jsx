import React, { useEffect, useState } from "react";
import {
  Drawer,
  Button,
  TextField,
  List,
  ListItem,
  ListItemText,
  Link,
  Tooltip,
} from "@mui/material";
import PersonSearchIcon from "@mui/icons-material/PersonSearch";
import { dispatchHook } from "../../hooks/useDispatch";
import { highlightColor } from "../Utils/colors";
import { historyHook } from "../../hooks/useHistory";
import { capitalizeFirstWord } from "../Utils/helpers";
// ~~~~~~~~~~ Components ~~~~~~~~~~ //
import SearchButtons from "./SearchButtons";
import LinearProgressBar from "../LinearProgressBar/LinearProgressBar";
import SearchOptions from "./SearchOptions";

const refIdStyle = {
  ...highlightColor,
  padding: 3,
  borderRadius: 4,
};

const TopDrawer = ({ sellers }) => {
  const dispatch = dispatchHook();
  const history = historyHook();
  const [open, setOpen] = useState(false);
  const [lastName, setLastName] = useState("");
  const [refId, setRefId] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchInitiated, setSearchInitiated] = useState(false);
  const [searchByLastName, setSearchByLastName] = useState(false);
  const [searchByRefId, setSearchByRefId] = useState(false);

  // useEffect(() => {
  //   // Update searchResults when sellers prop changes
  //   setSearchResults(sellers ? sellers : []);
  // }, [sellers]);
  useEffect(() => {
    setLoading(true);
    // Update searchResults when sellers prop changes
    setSearchResults(sellers ? sellers : []);
    setTimeout(() => {
      setLoading(false);
    }, 0);
  }, [sellers]);

  useEffect(() => {
    // Reset searchInitiated to false when lastName changes (indicating a new search)
    setSearchInitiated(false);
  }, [lastName]);

  // add conditions for if last name or ref id, and set state
  // accordingly
  const handleSearchChange = (e) => {
    const searchTerm = e.target.value;
    if (searchByLastName) {
      setLastName(capitalizeFirstWord(searchTerm));
    }

    if (searchByRefId) {
      setRefId(searchTerm);
    }
  };

  const handleFetchSellerByName = () => {
    setSearchInitiated(true); // Set searchInitiated to true when search is initiated
    // Dispatch a fetch action to retrieve sellers matching the search term
    const fetchSellersByName = {
      type: "FETCH_SELLER_BY_NAME",
      payload: {
        lastname: lastName,
      },
    };
    dispatch(fetchSellersByName);
  };

  const handleFetchSellerByRefId = () => {
    setSearchInitiated(true);

    const fetchByRefId = {
      type: "FETCH_SELLER_BY_REFID",
      payload: {
        refId: refId,
      },
    };
    dispatch(fetchByRefId);
  };

  const resetSearchedSellers = () => ({
    type: "RESET_SEARCHED_SELLERS",
  });

  const resetSearchField = () => {
    setLastName("");
    setRefId("");
    setSearchResults([]);
    // Clear the reducer
    dispatch(resetSearchedSellers());
  };

  const handleClose = () => {
    setOpen(false);
    resetSearchField();
  };

  const navigateToOrg = (orgId) => {
    setLoading(true); // Set loading to true first
    setTimeout(() => {
      // history.push(`/fargo/orgDetails/${orgId}`);
      history.push(`/fargo/orgDetails/${orgId}?isSellerSearched=true`);
      setLoading(false); // Set loading to false after navigation
    }, 0); // Use setTimeout to ensure the setLoading(false) runs after the state is updated
    resetSearchField();
  };

  const selectSearchBy = (value) => {
    if (value === "lastname") {
      setSearchByLastName(true);
      setSearchByRefId(false);
    }
    if (value === "refid") {
      setSearchByLastName(false);
      setSearchByRefId(true);
    }
  };

  return (
    <div>
      <Button sx={{ m: 2 }} onClick={() => setOpen(true)}>
        <PersonSearchIcon sx={{ mr: 1, fontSize: 30 }} />
        Sellers
      </Button>
      <Drawer anchor="top" open={open} onClose={handleClose}>
        <div style={{ padding: "16px", width: "50%", margin: "0 auto" }}>
          {/* ~~~~~ Search Radio Buttons ~~~~~ */}
          <SearchOptions
            onChange={selectSearchBy}
            resetSearchField={resetSearchField}
          />
          {searchByLastName && (
            <TextField
              label="Seller Last Name"
              variant="outlined"
              fullWidth
              value={lastName}
              onChange={handleSearchChange}
              sx={{ mb: 1 }}
            />
          )}
          {searchByRefId && (
            <TextField
              label="Seller Referral ID"
              variant="outlined"
              fullWidth
              value={refId}
              onChange={handleSearchChange}
              sx={{ mb: 1 }}
            />
          )}
          {/* ~~~~~ Action Buttons ~~~~~ */}
          {!loading && (
            <SearchButtons
              handleClose={handleClose}
              fetchByName={handleFetchSellerByName}
              searchByRefId={searchByRefId}
              fetchByRefId={handleFetchSellerByRefId}
            />
          )}
          <List>
            {searchResults.map((seller) => (
              <ListItem key={seller.id}>
                <ListItemText
                  primary={`${seller.firstname} ${seller.lastname}`}
                  //   secondary={`Ref ID: ${seller.refId} | Organization: ${seller.organization_name}`}
                  secondary={
                    <span>
                      <span style={refIdStyle}>
                        Ref ID:{" "}
                        <span style={{ fontWeight: "bold" }}>
                          {seller.refId}
                        </span>
                      </span>{" "}
                      | Organization:{" "}
                      <Tooltip title="Go to Organization">
                        <Link
                          component="button"
                          variant="body1"
                          underline="none"
                          onClick={() => navigateToOrg(seller.organization_id)}
                          sx={{ mb: 0.5 }}
                        >
                          {seller.organization_name}
                        </Link>
                      </Tooltip>
                    </span>
                  }
                />
              </ListItem>
            ))}
            {/* {searchInitiated &&
              searchResults.length === 0 &&
              !loading &&
              lastName.trim() !== "" && (
                <p>No results found for "{lastName}"</p>
              )} */}
            {(searchInitiated &&
              searchByLastName &&
              searchResults.length === 0 &&
              lastName.trim() !== "") ||
            (searchInitiated &&
              searchByRefId &&
              searchResults.length === 0 &&
              refId.trim() !== "") ? (
              <p>
                No results found for "{searchByLastName ? lastName : refId}"
              </p>
            ) : null}
          </List>
          {/* ~~~~~ Loading Message ~~~~~ */}
          {loading && (
            <>
              <LinearProgressBar />
              <p>Loading Organization Details...</p>
            </>
          )}
        </div>
      </Drawer>
    </div>
  );
};

export default TopDrawer;
