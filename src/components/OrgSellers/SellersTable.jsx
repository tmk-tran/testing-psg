import React, { useEffect, useState, useLayoutEffect } from "react";
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
  TableFooter,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import LaunchIcon from "@mui/icons-material/Launch";
import EditIcon from "@mui/icons-material/Edit";
import EditAttributesIcon from "@mui/icons-material/EditAttributes";
// ~~~~~~~~~~ Hooks ~~~~~~~~~~ //
import { columns } from "./sellerTableColumns";
import { dispatchHook } from "../../hooks/useDispatch";
import {
  User,
  oSellers,
  allYears,
  appActiveYear,
} from "../../hooks/reduxStore";
import { primaryColor } from "../Utils/colors";
import { showDeleteSweetAlert, showSaveSweetAlert } from "../Utils/sweetAlerts";
// ~~~~~~~~~~ Components ~~~~~~~~~~ //
import SellerForm from "./SellerForm";
import CustomButton from "../CustomButton/CustomButton";
import ActionIcons from "./ActionIcons";
import ViewUrl from "./ViewUrl";
import ActionButton from "./ActionButton";
import SellersTableHeader from "./SellersTableHeader";
import BooksSoldForm from "./BooksSoldForm";
import YearSelect from "./YearSelect";

const evenRowColor = {
  backgroundColor: "#f9f9f9",
};

const sellersBorder = {
  border: `1px solid ${primaryColor.color}`,
  borderRadius: "5px",
};

export default function SellersTable({ forwardedRef }) {
  const dispatch = dispatchHook();
  const paramsObject = useParams();
  const orgId = paramsObject.id;
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState("add");
  const [sellerToEdit, setSellerToEdit] = useState(null);
  const [showSellerUrl, setShowSellerUrl] = useState(false);
  const [sellerRefId, setSellerRefId] = useState(null);
  const [viewUrlTable, setViewUrlTable] = useState(false);
  const [modeEditBooks, setModeEditBooks] = useState(false);
  const [booksSold, setBooksSold] = useState(0);
  const [editingRefId, setEditingRefId] = useState(null);
  const [updateActions, setUpdateActions] = useState([]);

  const user = User() || [];
  const sellers = oSellers() || [];
  const year = appActiveYear() || [];
  const yearId = year.length > 0 ? year[0].id : null;
  const availableYears = allYears();
  const [viewYearId, setViewYearId] = useState(year ? yearId : null);

  // move this to Details parent component, and
  // send the store data as props to this component
  useEffect(() => {
    const dispatchAction = {
      type: "FETCH_SELLERS",
      payload: {
        orgId: paramsObject.id,
        yearId: yearId,
      },
    };
    // console.log(dispatchAction);
    dispatch(dispatchAction);
  }, []);

  useEffect(() => {
    if (viewYearId !== null) {
      const dispatchAction2 = {
        type: "FETCH_SELLERS",
        payload: {
          orgId: paramsObject.id,
          yearId: viewYearId,
        },
      };
      // console.log(dispatchAction2);
      dispatch(dispatchAction2);
    }
  }, [viewYearId]);

  useLayoutEffect(() => {
    if (forwardedRef && forwardedRef.current && sellers.length > 0) {
      // Delay the scroll operation slightly to allow the table to render completely
      setTimeout(() => {
        forwardedRef.current.scrollIntoView({ behavior: "instant" });
      }, 100); // Adjust the delay as needed
    }
    // No need to clear forwardedRef here
  }, [forwardedRef, sellers.length]);

  // Get only active year ID
  const activeYears = availableYears
    .filter((year) => year.active)
    .map((year) => year.id);

  // Disable buttons if the selected year is not active
  const isYearActive = activeYears.includes(viewYearId);

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
    const sellerToEdit = sellers.find((seller) => seller.id === id);

    if (sellerToEdit) {
      setSellerToEdit(sellerToEdit);
      setMode(mode);
      setOpen(true);
    }
  };

  // Adding a new seller //
  const handleAddSeller = (formData) => {
    const formDataWithId = {
      ...formData,
      organization_id: paramsObject.id,
      coupon_book_id: yearId,
    };

    const action = {
      type: "ADD_SELLER",
      payload: formDataWithId,
    };
    // console.log("Dispatching action:", action);
    dispatch(action);
    showSaveSweetAlert({ label: "Seller Added" });
  };

  const handleEditSeller = (editedSeller) => {
    const editAction = {
      type: "EDIT_SELLER",
      payload: editedSeller,
    };
    dispatch(editAction);
    // console.log("Dispatching action:", editAction);

    // Dispatch each update action from updateActions
    updateActions.forEach((action) => {
      // console.log("Dispatching action:", action);
      dispatch(action);
    });

    // Reset updateActions state
    setUpdateActions([]);
    showSaveSweetAlert({ label: "Seller Updated" });
  };

  const handleArchive = (sellerId) => {
    const orgId = paramsObject.id;
    // Use showDeleteSweetAlert and pass a callback function to execute upon confirmation
    showDeleteSweetAlert(() => {
      const archiveAction = {
        type: "ARCHIVE_SELLER",
        payload: { sellerId, orgId },
      };
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
    setShowSellerUrl(true);
    setSellerRefId(value);
  };

  const handleCloseViewUrl = () => {
    setShowSellerUrl(false);
  };
  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

  // ~~~~~~ Open / Close edit form for physical books sold ~~~~~~ //
  const openEditBooksSold = (refId, value) => {
    setModeEditBooks(true);
    setBooksSold(value);
    setEditingRefId(refId);
  };

  const closeEditBooksSold = () => {
    setModeEditBooks(false);
    setBooksSold(0);
  };
  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

  let isEvenRow = true;

  function calculateColumnSum(sellers, columnId) {
    return sellers.reduce((acc, seller) => {
      const value = seller[columnId];
      const numericValue = Number(value);
      return !isNaN(numericValue) ? acc + numericValue : acc;
    }, 0);
  }

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
        {/* ~~~~~ Year View ~~~~~ */}
        <YearSelect
          sx={{ minWidth: 150, p: 1 }}
          year={year}
          setYear={setViewYearId}
        />
        {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
        {/* ~~~~~~~~~~ Header ~~~~~~~~~~ */}
        <SellersTableHeader
          viewUrlTable={viewUrlTable}
          setViewUrlTable={setViewUrlTable}
        />
        {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
        {/* ~~~~~~~~~~ Add Seller Button ~~~~~~~~ */}
        <Box sx={{ p: 1 }}>
          <CustomButton
            label="New Seller"
            variant="contained"
            sx={{ height: "100%" }}
            onClick={() => handleOpen("add")}
            icon={<AddIcon />}
            title="Add a new seller"
          />
        </Box>
      </Box>
      {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
      {/* ~~~~~~~ Modals for Seller Table ~~~~~ */}
      <SellerForm
        user={user}
        orgId={orgId}
        columns={columns}
        open={open}
        mode={mode}
        handleClose={handleClose}
        handleAddSeller={handleAddSeller}
        handleEditSeller={handleEditSeller}
        sellerToEdit={sellerToEdit}
        updateActions={updateActions}
        setUpdateActions={setUpdateActions}
      />
      {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
      {/* ~~~~~~~~~~ Form for updating books sold ~~~~~~~~~~ */}
      <BooksSoldForm
        open={modeEditBooks}
        handleClose={closeEditBooksSold}
        orgId={orgId}
        editingRefId={editingRefId}
        yearId={yearId}
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
        <TableContainer sx={{ maxHeight: 600, overflowX: "auto" }}>
          {/* {!viewUrlTable ? ( */}
          <Table ref={forwardedRef} stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    align={column.align}
                    sx={{
                      minWidth: column.minWidth ? column.minWidth : "auto",
                      width: column.width,
                      // height: 50,
                      // wordWrap: "break-word",
                      // whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      border: "1px solid #f0f0f0",
                      backgroundColor: "#d9d9d9",
                      lineHeight: 1,
                      fontSize: "1.1rem",
                      maxWidth: 75, // Add this line to force ellipsis
                    }}
                    title={column.label}
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
                      key={seller.id}
                      id={`seller-row-${seller.id}`}
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
                              ...(column.id === "books_due" && {
                                backgroundColor: "rgba(111, 160, 216, 0.1)",
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
                                  title="View URL"
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
                                  disabled={!isYearActive}
                                />
                              </div>
                            )}
                            {/* ~~~~~ Money Data Cells ~~~~~ */}
                            {column.id === "donations" && <>$</>}
                            {column.id === "digital_donations" && <>$</>}
                            {column.id === "digital" && <>$</>}
                            {column.id === "checks" && <>$</>}
                            {column.id === "cash" && <>$</>}
                            {column.id === "seller_earnings" && <>$</>}
                            {column.id === "total_seller_earnings" && <>$</>}
                            {/* ~~~~~ Action Icons ~~~~~ */}
                            {column.id !== "refId" &&
                              (column.id === "actions" ? (
                                <>
                                  <ActionIcons
                                    seller={seller}
                                    onEdit={(id) => handleEditOpen(id, "edit")}
                                    handleArchive={handleArchive}
                                    disabled={!isYearActive}
                                  />
                                  {/* <SellerLink seller={seller} /> */}
                                </>
                              ) : column.id === "physical_book_cash" ? (
                                <>
                                  {value}
                                  <ActionButton
                                    title="Edit Books Sold"
                                    Icon={EditIcon}
                                    iconSx={{ fontSize: "large" }}
                                    buttonSx={{ ml: 1 }}
                                    onClick={() =>
                                      openEditBooksSold(seller.refId, value)
                                    }
                                    onMouseOver={(e) =>
                                      (e.currentTarget.style.transform =
                                        "scale(1.3)")
                                    }
                                    onMouseOut={(e) =>
                                      (e.currentTarget.style.transform =
                                        "scale(1)")
                                    }
                                    disabled={!isYearActive}
                                  />
                                  {/* {value} */}
                                </>
                              ) : column.format && typeof value === "number" ? (
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
            {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
            {/* ~~~~~~~~~~ Table Footer ~~~~~~~~~~ */}
            <TableFooter
              sx={{ position: "sticky", bottom: 0, background: "white" }}
            >
              <TableRow>
                {/* <TableCell>Total:</TableCell> */}
                {columns.map((column) => {
                  const sum = calculateColumnSum(sellers, column.id);
                  const displaySum = !isNaN(sum); // Check if sum is a valid number and not zero
                  const isExcludedColumn =
                    // column.id === "refId" ||
                    column.id === "lastname" ||
                    column.id === "firstname" ||
                    column.id === "level" ||
                    // column.id === "teacher" ||
                    column.id === "notes" ||
                    column.id === "actions"; // Add conditions to exclude columns
                  const isTotalCell = column.id === "teacher"; // Specify the column to show 'Total'

                  return (
                    <React.Fragment key={column.id}>
                      {!isExcludedColumn ? (
                        <TableCell
                          key={column.id}
                          sx={{
                            minWidth: column.minWidth,
                            width: column.width,
                            border: "1px solid #f0f0f0",
                            backgroundColor: "#d9d9d9",
                            lineHeight: 1,
                            fontSize: "1.1rem",
                            textAlign: "right",
                            fontWeight: "bold",
                          }}
                        >
                          {/* ~~~~~~ Cells to display Totals ~~~~~~ */}
                          {isTotalCell
                            ? "Totals:"
                            : displaySum
                            ? column.id === "cash" ||
                              column.id === "checks" ||
                              column.id === "donations" ||
                              column.id === "digital_donations" ||
                              column.id === "digital" ||
                              column.id === "seller_earnings" ||
                              column.id === "total_seller_earnings"
                              ? "$" + parseFloat(sum).toFixed(2)
                              : column.id === "refId"
                              ? `Sellers: ${Number(sellers.length)}`
                              : sum
                            : null}
                        </TableCell>
                      ) : (
                        <TableCell
                          sx={{
                            minWidth: column.minWidth,
                            width: column.width,
                            // height: 50,
                            border: "1px solid #f0f0f0",
                            backgroundColor: "#d9d9d9",
                            lineHeight: 1,
                            fontSize: "1.1rem",
                            textAlign: "right",
                            fontWeight: "bold",
                          }}
                        />
                      )}
                    </React.Fragment>
                  );
                })}
              </TableRow>
            </TableFooter>
          </Table>
          {/* ) : null} */}
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
