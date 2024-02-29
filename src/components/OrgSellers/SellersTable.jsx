import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
// ~~~~~~~~~~ Style ~~~~~~~~~~
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  ToolTip,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import LaunchIcon from "@mui/icons-material/Launch";
// ~~~~~~~~~~ Hooks ~~~~~~~~~~
import { columns } from "./sellerTableColumns";
import { dispatchHook } from "../../hooks/useDispatch";
import { User, oSellers } from "../../hooks/reduxStore";
// ~~~~~~~~~~ Component ~~~~~~~~~~
import SellerForm from "./SellerForm";
import CustomButton from "../CustomButton/CustomButton";
import ActionIcons from "./ActionIcons";
import ViewUrl from "./ViewUrl";
import { errorColor, primaryColor } from "../Utils/colors";
import { border } from "../Utils/colors";
import { showDeleteSweetAlert, showSaveSweetAlert } from "../Utils/sweetAlerts";
import SellerLink from "../SellerPage/SellerLink";
import ActionButton from "./ActionButton";
import SellersTableHeader from "./SellersTableHeader";

const evenRowColor = {
  backgroundColor: "#fbfbfb",
};

const sellersBorder = {
  border: `1px solid ${primaryColor.color}`,
  borderRadius: "5px",
};

function generateRefId(firstName, lastName, teacher) {
  const firstInitial = firstName.charAt(0).toUpperCase();
  const lastInitial = lastName.charAt(0).toUpperCase();
  const teacherInitials = teacher
    .split(" ")
    .map((name) => name.charAt(0).toUpperCase())
    .join("");
  // const randomDigits = Math.floor(1000 + Math.random() * 9000); // Generate random 4-digit number
  const randomDigits = Math.floor(100000 + Math.random() * 900000); // Generate random 6-digit number

  return `${firstInitial}${lastInitial}${teacherInitials}${randomDigits}`;
}

// Example usage
const firstName = "John";
const lastName = "Doe";
const teacher = "Jane Smith";
const refId = generateRefId(firstName, lastName, teacher);
console.log(refId);

export default function SellersTable() {
  const dispatch = dispatchHook();
  const paramsObject = useParams();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState("add");
  console.log(mode);
  const [sellerToEdit, setSellerToEdit] = useState(null);
  const [showSellerUrl, setShowSellerUrl] = useState(false);
  console.log(showSellerUrl);
  const [sellerRefId, setSellerRefId] = useState(null);
  console.log(sellerRefId);
  const [viewUrlTable, setViewUrlTable] = useState(false);
  console.log(viewUrlTable);

  useEffect(() => {
    dispatch({ type: "FETCH_SELLERS", payload: paramsObject.id });
  }, []);

  const sellers = oSellers() || [];
  console.log(sellers);
  const user = User() || [];
  console.log(user);

  // ~~~~~~ Open / Close Seller Form ~~~~~~ //
  const handleOpen = (mode) => {
    setMode(mode);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setMode("add");
  };
  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

  const handleEditOpen = (id, mode) => {
    console.log(id);
    console.log(mode);

    const sellerToEdit = sellers.find((seller) => seller.id === id);
    console.log(sellerToEdit);
    if (sellerToEdit) {
      setSellerToEdit(sellerToEdit);
      setMode(mode);
      setOpen(true);
    }
  };

  const handleAddSeller = (formData) => {
    const formDataWithId = {
      ...formData,
      organization_id: paramsObject.id,
    };

    const action = {
      type: "ADD_SELLER",
      payload: formDataWithId,
    };
    console.log("Dispatching action:", action);
    dispatch(action);
    showSaveSweetAlert();
  };

  const handleEditSeller = (editedSeller) => {
    const editAction = {
      type: "EDIT_SELLER",
      payload: editedSeller,
    };
    console.log("Dispatching action:", editAction);
    dispatch(editAction);
    showSaveSweetAlert();
  };

  const handleArchive = (sellerId) => {
    const orgId = paramsObject.id;
    // Use showDeleteSweetAlert and pass a callback function to execute upon confirmation
    showDeleteSweetAlert(() => {
      const archiveAction = {
        type: "ARCHIVE_SELLER",
        payload: { sellerId, orgId },
      };
      console.log("Dispatching action:", archiveAction);
      dispatch(archiveAction);
    }, "archiveStudent");
  };

  // ~~~~~ Pagination ~~~~~~~~~~~~~~~~~~~~~~~~ //
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

  // ~~~~~ Open / Close URL modal ~~~~~ //
  const handleViewUrl = (value) => {
    console.log(value);
    setShowSellerUrl(true);
    setSellerRefId(value);
  };

  const handleCloseViewUrl = () => {
    setShowSellerUrl(false);
  };
  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

  let isEvenRow = true;

  return (
    <Box sx={{ mt: 3 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          mb: 1,
          ...sellersBorder,
        }}
      >
        {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
        {/* ~~~~~~~~~~ Header ~~~~~~~~~~ */}
        <SellersTableHeader
          viewUrlTable={viewUrlTable}
          setViewUrlTable={setViewUrlTable}
        />
        {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
        {/* ~~~~~~~~~~ Add Seller Button ~~~~~~~~ */}
        <CustomButton
          label="New Seller"
          variant="contained"
          // onClick={handleOpen}
          onClick={() => handleOpen("add")}
          icon={<AddIcon />}
        />
      </Box>
      {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
      {/* ~~~~~~~ Modals for Seller Table ~~~~~ */}
      <SellerForm
        user={user}
        columns={columns}
        open={open}
        mode={mode}
        handleClose={handleClose}
        handleAddSeller={handleAddSeller}
        handleEditSeller={handleEditSeller}
        sellerToEdit={sellerToEdit}
      />
      {/* ~~~~~~~~~~~ View URL modal ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
      <ViewUrl
        open={showSellerUrl}
        close={handleCloseViewUrl}
        sellerRefId={sellerRefId}
      />
      {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~  */}
      {/* ~~~~~~~~~~ Seller Table ~~~~~~~~~~ */}
      <Paper elevation={3} sx={{ width: "100%" }}>
        <TableContainer sx={{ maxHeight: 600 }}>
          {!viewUrlTable ? (
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  {columns.map((column) => (
                    <TableCell
                      key={column.id}
                      align={column.align}
                      sx={{
                        minWidth: column.minWidth,
                        width: column.width,
                        height: 50,
                        wordWrap: "break-word",
                        border: "1px solid #f0f0f0",
                        backgroundColor: "#d9d9d9",
                        lineHeight: 1,
                        fontSize: "1.1rem",
                      }}
                    >
                      {column.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
              {/* ~~~~~ Table Body ~~~~~~~~~~ */}
              <TableBody>
                {sellers
                  .filter((seller) => !seller.is_deleted) // Filter out deleted sellers
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((seller, index) => {
                    isEvenRow = !isEvenRow; // Toggle the variable for each row
                    return (
                      <TableRow
                        hover
                        role="checkbox"
                        tabIndex={-1}
                        key={index}
                        sx={{
                          ...(isEvenRow
                            ? { backgroundColor: evenRowColor }
                            : null),
                        }}
                      >
                        {columns.map((column) => {
                          const value = seller[column.id];
                          return (
                            <TableCell
                              key={column.id}
                              align={column.align}
                              sx={{
                                border: "1px solid #e0e0e0",
                                padding: "8px",
                                ...(column.id === "notes" && {
                                  maxWidth: "250px",
                                  maxHeight: "50px",
                                  // overflow: "hidden",
                                  overflowWrap: "break-word",
                                  // textOverflow: "ellipsis",
                                  // whiteSpace: "no-wrap",
                                }),
                              }}
                            >
                              {column.id === "refId" && (
                                <div
                                  style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                  }}
                                >
                                  {value}
                                  {/* ~~~~~~~~~~~~~~~~~~~~~~~~~ */}
                                  {/* ~~~~~ View URL Icon ~~~~~ */}
                                  <ActionButton
                                    title="View URLs"
                                    Icon={LaunchIcon}
                                    iconSx={{ fontSize: "25px" }}
                                    onClick={() => handleViewUrl(value)}
                                    onMouseOver={(e) =>
                                      (e.currentTarget.style.transform =
                                        "scale(1.3)")
                                    }
                                    onMouseOut={(e) =>
                                      (e.currentTarget.style.transform =
                                        "scale(1)")
                                    }
                                  />
                                </div>
                              )}
                              {/* ~~~~~ Action Icons ~~~~~ */}
                              {column.id !== "refId" &&
                                (column.id === "actions" ? (
                                  <>
                                    <ActionIcons
                                      seller={seller}
                                      onEdit={(id) =>
                                        handleEditOpen(id, "edit")
                                      }
                                      handleArchive={handleArchive}
                                    />
                                    {/* <SellerLink seller={seller} /> */}
                                  </>
                                ) : column.format &&
                                  typeof value === "number" ? (
                                  column.format(value)
                                ) : (
                                  value
                                ))}
                            </TableCell>
                          );
                        })}
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          ) : null}
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={sellers.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Box>
  );
}
