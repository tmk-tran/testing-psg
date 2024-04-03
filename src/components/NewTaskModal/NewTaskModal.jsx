import React, { useEffect, useState } from "react";
import { Backdrop, Divider, Tooltip } from "@mui/material";
// ~~~~~~~~~~ Hooks ~~~~~~~~~~
import { dispatchHook } from "../../hooks/useDispatch";
import { allMerchants, allOrganizations } from "../../hooks/reduxStore";
// ~~~~~~~~~~ Style ~~~~~~~~~~
import {
  Box,
  Button,
  Modal,
  Typography,
  TextField,
  Select,
  MenuItem,
  InputLabel,
} from "@mui/material";
// ~~~~~~~~~~ Icons ~~~~~~~~~~
import AddBoxIcon from "@mui/icons-material/AddBox";
// ~~~~~~~~~~ Hooks ~~~~~~~~~~
import { border, hoverAccept, hoverDeny } from "../Utils/colors";
import { lineDivider, modalHeaderStyle } from "../Utils/modalStyles";
import { capitalizeFirstWord, saveBtnWidth } from "../Utils/helpers";
// ~~~~~~~~~~ Components ~~~~~~~~~~
import DatePicker from "../DatePicker/DatePicker";
import SearchableSelect from "../NewTaskModal/SearchableSelect";
import CloseButton from "../Buttons/CloseButton";
import ModalButtons from "../Modals/ModalButtons";
import { showSaveSweetAlert } from "../Utils/sweetAlerts";
import { useSelector } from "react-redux";
import { formatDate } from "../Utils/helpers";
import YearSelect from "../OrgSellers/YearSelect";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 450,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
  maxHeight: "80vh",
  overflow: "auto",
};

const taskOptions = {
  Contact: ["Initial Contact", "Follow Up Call/Email/Text", "Follow Up Visit"],
  Coupon: ["Add-on Request", "New Create Proof", "Update Create Proof"],
  Book: ["Drop Off Books", "Organization Picking Up Books"],
  Task: [
    "Organization Dropping Books Off",
    "Received Payment",
    "Send Invoice",
    "Other",
  ],
};

const userOptions = ["Chris", "Lacey", "Wendy"];

// ~~~~~~~~~ ADD USE ALERT HERE FOR SUCCESS ALERT ~~~~~~~~~~~~~~~~~~~ ADD USE ALERT HERE FOR SUCCESS ALERT ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
export default function BasicModal({
  tabs,
  merchantTab,
  customIcon,
  customText,
  caseType,
}) {
  console.log(tabs);
  console.log(merchantTab);
  console.log(caseType);
  const dispatch = dispatchHook();
  const auth = useSelector((store) => store.auth)
  // ~~~~~~~~~~ All Merchants from store ~~~~~~~~~~
  const merchants = allMerchants();
  console.log(merchants);
  // ~~~~~~~~~~ All Organizations from store ~~~~~~~~~~
  const organizations = allOrganizations();
  console.log(organizations);
  // ~~~~~~~~~~ Modal State ~~~~~~~~~~
  const [open, setOpen] = useState(false);
  // ~~~~~~~~~~ Menu State ~~~~~~~~~~
  const [firstMenuChoice, setFirstMenuChoice] = useState("");
  const [secondMenuChoice, setSecondMenuChoice] = useState("");
  const [thirdMenuChoice, setThirdMenuChoice] = useState("");
  console.log(thirdMenuChoice);
  const [bookYearId, setBookYearId] = useState(null);
  const [organizationId, setOrganizationId] = useState(null);
  const [merchantId, setMerchantId] = useState(null);
  console.log(merchantId);
  const [fourthMenuChoice, setFourthMenuChoice] = useState("");
  const [couponDetails, setCouponDetails] = useState("");
  const [showDetailsInput, setShowDetailsInput] = useState(false);
  const [dueDate, setDueDate] = useState(new Date());
  const [additionalDetails, setAdditionalDetails] = useState("");
  console.log(additionalDetails);

  useEffect(() => {
    // Conditional logic based on merchantTab
    merchantTab
      ? /* Logic for merchantTab being true */
        (dispatch({ type: "FETCH_MERCHANTS", payload: auth }),
        console.log("Merchant Tab is true"))
      : /* Logic for merchantTab being false */
        (dispatch({ type: "FETCH_ORGANIZATIONS", payload: auth }),
        console.log("Merchant Tab is false"));

    // Cleanup function or dependencies for useEffect
  }, [merchantTab]);
  
  const resetForm = () => {
    // Reset form fields
    setFirstMenuChoice("");
    setSecondMenuChoice("");
    setThirdMenuChoice("");
    setBookYearId(null);
    setOrganizationId(null);
    setMerchantId(null);
    setFourthMenuChoice("");
    setDueDate("");
    setShowDetailsInput(false);
    setAdditionalDetails("");
    setCouponDetails("");
    setAdditionalDetails("");
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    resetForm();
    setOpen(false);
  };
  const handleFirstMenuChange = (event) => {
    const choice = event.target.value;
    setFirstMenuChoice(choice);
    setSecondMenuChoice("");
    setThirdMenuChoice("");
  };

  const handleSecondMenuChange = (event) => {
    const choice = event.target.value;
    setSecondMenuChoice(choice);
    setThirdMenuChoice("");

    // Check if the selected option requires showing the details input
    setShowDetailsInput(
      choice === "New Create Proof" || choice === "Add-on Request"
    );
  };

  const handleAccountChange = (event, value) => {
    console.log(value);
    const selectedName = value;
    console.log(selectedName);

    if (merchantTab) {
      // Logic for merchantTab being true
      const selectedId =
        merchants.find((merchant) => merchant.merchant_name === selectedName)
          ?.id || "";

      console.log(merchants);
      console.log(selectedId);
      console.log(selectedName);
      setThirdMenuChoice(selectedName);
      setMerchantId(selectedId);
      console.log(selectedId);
    } else {
      // Logic for merchantTab being false (organizations logic)
      const selectedId =
        organizations.organization.find(
          (organization) => organization.organization_name === selectedName
        )?.id || "";

      console.log(selectedName);
      setThirdMenuChoice(selectedName);
      setOrganizationId(selectedId);
      console.log(selectedId);
    }
  };

  const handleDateChange = (date) => {
    const formattedDate = date.$d.toISOString().split('T')[0];
  
    setDueDate(formattedDate);
  };
  

  const addNewTask = () => {
    const actionType = merchantTab
      ? "ADD_MERCHANT_TASK"
      : "ADD_ORGANIZATION_TASK";

    const payload =
      caseType === "merchantView"
        ? {
            // Include properties specific to the 'merchantView' case
            fetchType: "FETCH_MERCHANT_TASKS",
            category: firstMenuChoice,
            task: secondMenuChoice,
            merchant_id: merchantId,
            merchant_name: thirdMenuChoice,
            assign: fourthMenuChoice,
            due_date: dueDate,
            description: additionalDetails,
            task_status: "New",
            coupon_details: couponDetails,
            book_id: bookYearId,
          }
        : merchantTab
        ?  {
            category: firstMenuChoice,
            task: secondMenuChoice,
            merchant_id: merchantId,
            merchant_name: thirdMenuChoice,
            assign: fourthMenuChoice,
            due_date: dueDate,
            description: additionalDetails,
            task_status: "New",
            coupon_details: couponDetails,
            book_id: bookYearId,
          }
        :   {
            // Adjust the payload properties for organization logic
            // Example:
            category: firstMenuChoice,
            task: secondMenuChoice,
            organization_id: organizationId,
            organization_name: thirdMenuChoice,
            assign: fourthMenuChoice,
            due_date: dueDate,
            description: additionalDetails,
            task_status: "New"
            // Adjust other properties as needed
          };

    dispatch({
      type: actionType,
      payload: {newTask: payload,
        auth: auth}
    });

    showSaveSweetAlert({ label: "Task Added" });
    handleClose();
  };

  return (
    <div>
      <Tooltip title="New Task">
        <Button
          variant={tabs ? "text" : "contained"}
          sx={{ mt: 1 }}
          onClick={handleOpen}
          fullWidth
        >
          {customIcon ? (
            customIcon // Render the custom icon if provided
          ) : (
            // <LibraryAddIcon />
            <AddBoxIcon />
          )}
          {customText && (
            <span style={{ marginLeft: "5px" }}>{customText}</span>
          )}
        </Button>
      </Tooltip>

      <Modal
        open={open}
        onClose={handleClose}
        BackdropComponent={Backdrop}
        BackdropProps={{
          // Disable closing on backdrop click
          onClick: (event) => event.stopPropagation(),
          // Disable the backdrop from being clickable
          clickable: false,
        }}
      >
        <Box sx={style}>
          {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
          {/* ~~~~~~~~~~~~ HEADER ~~~~~~~~~~~~~~~~~~ */}
          <Typography variant="h6" sx={modalHeaderStyle}>
            New Task
          </Typography>
          <Divider sx={lineDivider} />

          <div style={{ display: "flex", flexDirection: "column" }}>
            <InputLabel>Category:</InputLabel>
            {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
            {/* ~~~~~~~~~~~~ FIRST DROPDOWN ~~~~~~~~~~~~ */}
            {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
            <Select
              value={firstMenuChoice}
              onChange={handleFirstMenuChange}
              sx={{ margin: "5px 0" }}
            >
              <MenuItem value="Book">Book</MenuItem>
              {(merchantTab || caseType === "merchantView") && (
                <MenuItem value="Coupon">Coupon</MenuItem>
              )}
              <MenuItem value="Contact">Contact</MenuItem>
              <MenuItem value="Task">Task</MenuItem>
            </Select>
            {/* ~~~~~~~~~~~~~~~~ END ~~~~~~~~~~~~~~~~~~~~ */}

            <InputLabel>Task:</InputLabel>
            {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
            {/* ~~~~~~~~~~~ SECOND DROPDOWN ~~~~~~~~~~~~ */}
            {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
            <Select
              value={secondMenuChoice}
              onChange={handleSecondMenuChange}
              sx={{ margin: "5px 0" }}
            >
              {taskOptions[firstMenuChoice]?.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
            {/* ~~~~~~~~~~~~~~~~ END ~~~~~~~~~~~~~~~~~~~~ */}

            {/* ~~~~~ Year Select, Offer field ~~~~~ */}
            {showDetailsInput && (
              <YearSelect setYear={setBookYearId} />
            )}

            {showDetailsInput && (
              <TextField
                id="outlined-multiline-static"
                label="Coupon Offer"
                placeholder="Please enter coupon offer here..."
                fullWidth
                multiline
                rows={2}
                value={couponDetails}
                onChange={(event) => setCouponDetails(event.target.value)}
                sx={{ margin: "10px auto" }}
              />
            )}

            {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
            {/* ~~~~~~~~~~~~ THIRD DROPDOWN ~~~~~~~~~~~~ */}
            {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
            <InputLabel>Account Name:</InputLabel>
            {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
            {/* ~~~~~~~~~~~ SEARCHABLE FIELD ~~~~~~~~~~~ */}
            {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
            {merchantTab ? (
              <SearchableSelect
                thirdMenuChoice={thirdMenuChoice}
                handleAccountChange={handleAccountChange}
                merchantTab={true}
                merchants={merchants}
              />
            ) : (
              <SearchableSelect
                thirdMenuChoice={thirdMenuChoice}
                handleAccountChange={handleAccountChange}
                merchantTab={false}
                organizations={organizations}
              />
            )}
            {/* ~~~~~~~~~~~~~~~~ END ~~~~~~~~~~~~~~~~~~~~ */}

            <InputLabel>Assign To:</InputLabel>
            {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
            {/* ~~~~~~~~~~~ FOURTH DROPDOWN ~~~~~~~~~~~~ */}
            {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
            <Select
              value={fourthMenuChoice}
              onChange={(event) => setFourthMenuChoice(event.target.value)}
              sx={{ margin: "5px 0" }}
            >
              {userOptions.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
            {/* ~~~~~~~~~~~~~~~~ END ~~~~~~~~~~~~~~~~~~~~ */}

            {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
            {/* ~~~~~~~~~~~~~ DATE SECTION ~~~~~~~~~~~~~ */}
            {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
            <div>
              <DatePicker value={dueDate} initialDate={dueDate} onChange={handleDateChange} />
            </div>
            {/* ~~~~~~~~~~~~~~~~ END ~~~~~~~~~~~~~~~~~~~~ */}
          </div>

          {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
          {/* ~~~~~~~~~~ ADDITIONAL DETAILS ~~~~~~~~~~ */}
          {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
          <TextField
            id="outlined-multiline-static"
            label="Additional Details..."
            multiline
            rows={3}
            fullWidth
            sx={{ margin: "10px auto" }}
            value={additionalDetails}
            onChange={(event) =>
              setAdditionalDetails(capitalizeFirstWord(event.target.value))
            }
          />
          {/* ~~~~~~~~~~~~~~~~ END ~~~~~~~~~~~~~~~~~~~~ */}
          <ModalButtons
            label="Create Task"
            onSave={addNewTask}
            onCancel={handleClose}
          />
        </Box>
      </Modal>
    </div>
  );
}
