import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
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
// ~~~~~~~~~~ Hooks ~~~~~~~~~~ //
import { columns } from "./sellerTableColumns";
import { dispatchHook } from "../../hooks/useDispatch";
import { User, oSellers, bookYear, allYears } from "../../hooks/reduxStore";
import { primaryColor } from "../Utils/colors";
import { border } from "../Utils/colors";
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
import LoadingSpinner from "../HomePage/LoadingSpinner";

const evenRowColor = {
  backgroundColor: "#f9f9f9",
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
  const auth = useSelector((store) => store.auth);
  const orgId = paramsObject.id;
  const [isLoading, setIsLoading] = useState(true);
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
  const [modeEditBooks, setModeEditBooks] = useState(false);
  console.log(modeEditBooks);
  const [booksSold, setBooksSold] = useState(0);
  console.log(booksSold);
  const [editingRefId, setEditingRefId] = useState(null);
  console.log(editingRefId);
  const [updateActions, setUpdateActions] = useState([]);
  console.log(updateActions);

  const user = User() || [];
  const sellers = oSellers() || [];
  console.log(sellers);
  const year = bookYear() || [];
  console.log(year);
  const yearId = year.length > 0 ? year[0].id : null;
  console.log(yearId);
  const availableYears = allYears();
  const [viewYearId, setViewYearId] = useState(yearId);
  console.log(viewYearId);

  useEffect(() => {
    const dispatchAction = {
      type: "FETCH_SELLERS",
      payload: {
        orgId: paramsObject.id,
        yearId: yearId,
        auth: auth,
      },
    };
    console.log(dispatchAction);
    dispatch(dispatchAction);
  }, []);

  useEffect(() => {
    if (sellers.length > 0) {
      setIsLoading(false);
    }
  }, [sellers]);

  useEffect(() => {
    if (viewYearId !== null) {
      const dispatchAction2 = {
        type: "FETCH_SELLERS",
        payload: {
          orgId: paramsObject.id,
          yearId: viewYearId,
          auth: auth,
        },
      };
      console.log(dispatchAction2);
      dispatch(dispatchAction2);
    }
  }, [viewYearId]);

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

  // Adding a new seller //
  const handleAddSeller = (formData) => {
    const formDataWithId = {
      ...formData,
      organization_id: paramsObject.id,
      coupon_book_id: yearId,
    };

    const action = {
      type: "ADD_SELLER",
      payload: { newSeller: formDataWithId, auth: auth },
    };
    console.log("Dispatching action:", action);
    dispatch(action);
    showSaveSweetAlert({ label: "Seller Added" });
  };

  //FIGURE OUT WHERE EDITEDSELLER IS LOCATED------

  const handleEditSeller = (editedSeller) => {
    console.log(editedSeller);
    const archivedSeller = {
      id: editedSeller.id,
      refId: editedSeller.refId,
      lastname: editedSeller.lastname,
      firtname: editedSeller.firstname,
      level: editedSeller.level,
      teacher: editedSeller.teacher,
      initial_books: editedSeller.initial_books,
      additional_books: editedSeller.additional_books,
      books_returned: editedSeller.books_returned,
      cash: editedSeller.cash,
      checks: editedSeller.checks,
      digital: editedSeller.digital,
      note: editedSeller.note,
      organization_id: orgId,
      digital_donations: editedSeller.digital_donations,
      books_due: editedSeller.books_due,
      coupon_book_id: editedSeller.coupon_book_id,
    };
    const editAction = {
      type: "EDIT_SELLER",
      payload: { editedSeller: editedSeller, auth: auth },
    };
    dispatch(editAction);
    console.log("Dispatching action:", editAction);

    // Dispatch each update action from updateActions
    updateActions.forEach((action) => {
      console.log("Dispatching action:", action);
      dispatch(action);
    });

    // Reset updateActions state
    setUpdateActions([]);
    showSaveSweetAlert({ label: "Seller Updated" });
  };

  //REWRITE THIS TO WORK WITH DEVII-------
  const handleArchive = (seller) => {
    console.log(seller);
    const orgId = paramsObject.id;
    const archivedSeller = {
      id: seller.id,
      refId: seller.refId,
      lastname: seller.lastname,
      firtname: seller.firstname,
      level: seller.level,
      teacher: seller.teacher,
      initial_books: seller.initial_books,
      additional_books: seller.additional_books,
      books_returned: seller.books_returned,
      cash: seller.cash,
      checks: seller.checks,
      digital: seller.digital,
      note: seller.note,
      organization_id: orgId,
      digital_donations: seller.digital_donations,
      books_due: seller.books_due,
      coupon_book_id: seller.coupon_book_id,
    };
    console.log(archivedSeller);
    // Use showDeleteSweetAlert and pass a callback function to execute upon confirmation
    showDeleteSweetAlert(() => {
      const archiveAction = {
        type: "ARCHIVE_SELLER",
        payload: { archivedSeller: archivedSeller, auth: auth },
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

  // ~~~~~~ Open / Close edit form for physical books sold ~~~~~~ //
  const openEditBooksSold = (refId, value) => {
    console.log(refId);
    console.log(value);
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
      />
      {/* ~~~~~~~~~~~ View URL modal ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
      <ViewUrl
        open={showSellerUrl}
        close={handleCloseViewUrl}
        sellerRefId={sellerRefId}
      />
      {/* ~~~~~ Loading Page Spinner ~~~~~ */}
      {isLoading && (
        <LoadingSpinner
          text="Loading from database..."
          finalText="We're sorry, but the page is taking longer to load than expected. Please try again later"
          timeout={8000}
        />
      )}
      {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~  */}
      {/* ~~~~~~~~~~ Seller Table ~~~~~~~~~~ */}
      {!isLoading && (
        <Paper elevation={3} sx={{ width: "100%" }}>
          <TableContainer sx={{ maxHeight: 600, overflowX: "auto" }}>
            {/* {!viewUrlTable ? ( */}
            <Table stickyHeader aria-label="sticky table">
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
                        key={index}
                        sx={{
                          ...(isEvenRow
                            ? { backgroundColor: evenRowColor }
                            : null),
                        }}
                      >
                        {columns.map((column) => {
                          console.log(seller);
                          const value = seller[column.id];
                          console.log(value);
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
                              {/* ~~~~~ Cash Cell ~~~~~ */}
                              {column.id === "donations" && <>$</>}
                              {column.id === "digital_donations" && <>$</>}
                              {column.id === "digital" && <>$</>}
                              {column.id === "checks" && <>$</>}
                              {column.id === "cash" && <>$</>}
                              {column.id === "seller_earnings" && <>$</>}
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
                                      disabled={!isYearActive}
                                    />
                                    {/* <SellerLink seller={seller} /> */}
                                  </>
                                ) : column.id === "seller_earnings" ? (
                                  <>
                                    {
                                      seller.transactions_collection[0]
                                        .seller_earnings
                                    }
                                  </>
                                ) : column.id === "physical_book_cash" ? (
                                  <>
                                    {
                                      seller.transactions_collection[0]
                                        .physical_book_cash
                                    }

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
                                ) : column.id === "physical_book_digital" ? (
                                  <>
                                    {
                                      seller.transactions_collection[0]
                                        .physical_book_digital
                                    }
                                  </>
                                ) : column.id === "digital_book_credit" ? (
                                  <>
                                    {
                                      seller.transactions_collection[0]
                                        .digital_book_credit
                                    }
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
                      column.id === "refId" ||
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
                                column.id === "seller_earnings"
                                ? "$" + parseFloat(sum).toFixed(2)
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
      )}
    </Box>
  );
}
