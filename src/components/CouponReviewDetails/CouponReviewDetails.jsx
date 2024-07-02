import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
// ~~~~~~~~~~ Style ~~~~~~~~~~ //
import { Typography, Card, CardContent, Box, Button } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { dueDateHighlight } from "../Utils/colors";
// ~~~~~~~~~~ Components ~~~~~~~~~~ //
import DenyProofModal from "../DenyProofModal/DenyProofModal";
import CouponStatusDropdown from "../CouponStatusDropdown/CouponStatusDropdown";
import CouponReviewButtons from "./CouponReviewButtons";
import CouponReviewComments from "./CouponReviewComments";
import BackButton from "../Buttons/BackButton";
import FilePreview from "./FilePreview";
import UploadFileButton from "./UploadFileButton";
import CouponLocations from "../CouponLocations/CouponLocations";
import ToggleButton from "../ToggleButton/ToggleButton";
import EditButton from "../Buttons/EditButton";
import EditCouponModal from "./EditCouponModal";
// ~~~~~~~~~~ Hooks ~~~~~~~~~~ //
import { dispatchHook } from "../../hooks/useDispatch";
import {
  couponsData,
  mTasks,
  bookYear,
  appActiveYear,
} from "../../hooks/reduxStore";
import { centeredStyle, flexCenter, flexRowSpace } from "../Utils/pageStyles";
import { grayBackground } from "../Utils/colors";
import { capitalizeFirstWord, formatDate } from "../Utils/helpers";
import { showDeleteSweetAlert } from "../Utils/sweetAlerts";

const uploadBoxStyle = {
  width: "100%",
  backgroundColor: "white",
  ...flexCenter,
};

export default function CouponReviewDetails() {
  const dispatch = dispatchHook();
  const params = useParams();
  const merchantId = params.merchantId;
  const couponId = params.couponId;
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const [isModalOpen, setIsModalOpen] = useState(false);
  // ~~~~~~~~~~ Task Status State ~~~~~~~~~~ //
  const [isTaskUpdate, setIsTaskUpdate] = useState(false);
  const [completedCoupon, setCompletedCoupon] = useState(false);
  const [taskId, setTaskId] = useState("");
  const [taskStatus, setTaskStatus] = useState("");
  const [newTaskStatus, setNewTaskStatus] = useState("");
  // ~~~~~~~~~~ Comments State ~~~~~~~~~~ //
  const [commentAdded, setCommentAdded] = useState(false);
  const [changesRequested, setChangesRequested] = useState(false);
  // ~~~~~~~~~~ Uploaded Files State ~~~~~~~~~~ //
  const [uploadedFiles, setUploadedFiles] = useState(false);
  const [frontViewFile, setFrontViewFile] = useState(null);
  const [frontViewFilename, setFrontViewFilename] = useState("");
  const [backViewFile, setBackViewFile] = useState(null);
  const [backViewFilename, setBackViewFilename] = useState("");
  const [isUploaded, setIsUploaded] = useState(false);
  // ~~~~~~~~~~ View Locations State ~~~~~~~~~~ //
  const [showLocations, setShowLocations] = useState(false);
  // ~~~~~~~~~~ Book Year State ~~~~~~~~~~ //
  const [bookId, setBookId] = useState("");

  const files = couponsData() || [];
  const file = files.length > 0 ? files[0] : null;
  const formattedDate =
    file && file.expiration ? formatDate(file.expiration) : null;
  const tasks = mTasks() || [];
  const year = bookYear();
  // Get active year value to send as props to EditCouponModal
  const active = year[0];
  const assignedYear = active ? active.year : null;

  const couponTask = Array.isArray(tasks)
    ? tasks.find((task) => task.coupon_id === Number(couponId))
    : null;

  useEffect(() => {
    // Ensure that merchantId is available before dispatching the action
    if (merchantId) {
      // dispatch({ type: "FETCH_MERCHANT_COMMENTS", payload: merchantId });
      // dispatch({ type: "FETCH_COUPON_COMMENTS", payload: file.taskId });
      dispatch({ type: "FETCH_MERCHANT_TASKS", payload: merchantId });
      dispatch({ type: "FETCH_MERCHANT_LOCATION", payload: merchantId });
    }

    if (merchantId && file?.taskId !== null) {
      const action2 = {
        type: "FETCH_COUPON_COMMENTS",
        payload: file?.taskId,
      };
      dispatch(action2);
      setBookId(file ? file.bookId : "");
    }

    if (couponTask) {
      setTaskStatus(couponTask.task_status);
    }

    if (couponId) {
      dispatch({ type: "FETCH_PDF_FILE", payload: { merchantId, couponId } });
    }

    setChangesRequested(false);
    setCompletedCoupon(false);
    setUploadedFiles(false);
    setIsUploaded(false);
    setFrontViewFile(null);
    setBackViewFile(null);
  }, [merchantId, commentAdded, uploadedFiles, file?.taskId]);

  useEffect(() => {
    if (bookId) {
      // const action = {
      //   type: "FETCH_YEAR_BY_ID",
      //   payload: bookId,
      // };
      const action = {
        type: "FETCH_YEAR_BY_ID",
        reducerType: "SET_BOOK_YEAR",
        payload: bookId,
      };

      dispatch(action);
    }
  }, [bookId]);

  const handleDenyButtonClick = () => {
    // Open the modal when Deny button is clicked
    setIsModalOpen(true);
  };

  const handleUpdateTask = (taskId, choice, taskStatus) => {
    setTaskId(taskId);
    setNewTaskStatus(choice);
    setTaskStatus(taskStatus);
    setIsTaskUpdate(true);
  };

  const updateTaskState = (newValue) => {
    setIsTaskUpdate(newValue);
  };

  const updateComments = () => {
    setCommentAdded(true);
  };

  const handleChangeRequest = (boolean) => {
    setChangesRequested(boolean);
    setTaskStatus("In Progress");
  };

  const handleCompletedCoupon = (boolean) => {
    setCompletedCoupon(boolean);
    setTaskStatus("Complete");
  };

  const handleUploadFile = () => {
    setUploadedFiles(true);
  };

  // ~~~~~~~~~~ FRONT VIEW UPLOAD FUNCTIONS ~~~~~~~~~~ //
  const handleFrontViewUpload = (selectedFile, addedFileName) => {
    // console.log(selectedFile, addedFileName);
    setFrontViewFile(selectedFile);
    setFrontViewFilename(addedFileName);
  };

  const handleFrontUpload = () => {
    if (frontViewFile) {
      // Check if the selected file is a PDF
      if (frontViewFile.type === "application/pdf") {
        // Dispatch the action for uploading PDF
        const frontViewAction = {
          type: "UPLOAD_FRONT_VIEW_PDF",
          payload: {
            frontViewFile: frontViewFile,
            frontViewFileName: frontViewFilename,
            id: couponId,
          },
        };
        dispatch(frontViewAction);
        setIsUploaded(true);
        // onUploadFile();
      } else {
        // Alert the user if the selected file is not a PDF
        alert("Please select a PDF file");
      }
    } else {
      // Alert the user if no file is selected
      alert("No file selected");
    }
    handleUploadFile();
  };

  // ~~~~~~~~~~ BACK VIEW UPLOAD FUNCTIONS ~~~~~~~~~~ //
  const handleBackViewUpload = (selectedFile, addedFileName) => {
    setBackViewFile(selectedFile);
    setBackViewFilename(addedFileName);
  };

  const handleBackUpload = () => {
    if (backViewFile) {
      // Check if the selected file is a PDF
      if (backViewFile.type === "application/pdf") {
        // Dispatch the action for uploading PDF
        const backViewAction = {
          type: "UPLOAD_BACK_VIEW_PDF",
          payload: {
            backViewFile: backViewFile,
            backViewFileName: backViewFilename,
            id: couponId,
          },
        };
        dispatch(backViewAction);
        setIsUploaded(true); // Set isUploaded to true after successful upload
        // onUploadFile();
      } else {
        // Alert the user if the selected file is not a PDF
        alert("Please select a PDF file");
      }
    } else {
      // Alert the user if no file is selected
      alert("No file selected");
    }
    handleUploadFile();
  };

  const RenderValue = ({ label, value }) => (
    <Typography>
      <strong>{label}: </strong>
      {value !== null ? value : "No " + label.toLowerCase() + " set"}
    </Typography>
  );

  const handleToggleLocations = () => {
    setShowLocations(!showLocations);
  };

  const deleteFrontFile = (fileId) => {
    const frontAction = {
      type: "DELETE_FILE_FRONT",
      payload: fileId,
    };
    showDeleteSweetAlert(() => {
      dispatch(frontAction);
    }, "removePdf");
  };

  const deleteBackFile = (fileId) => {
    const backAction = {
      type: "DELETE_FILE_BACK",
      payload: fileId,
    };
    showDeleteSweetAlert(() => {
      dispatch(backAction);
    }, "removePdf");
  };

  return (
    <div className={`details-container ${isSmallScreen ? "small-screen" : ""}`}>
      <Box className="details-card">
        <div className="detailsView-container">
          {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
          {/* ~~~~~~~~~~ BACK BUTTON ~~~~~~~~~~ */}
          <BackButton />
          {/* ~~~~~~~~~~~~~~~~~~ */}
          {/* ~~~~~ HEADER ~~~~~ */}
          <Typography
            variant="h5"
            sx={{
              fontWeight: "bold",
              textAlign: "center",
              flexGrow: 1,
            }}
          >
            Coupon Details
          </Typography>
          {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
          {/* ~~~~~~~~~~ YEAR DISPLAY ~~~~~~~~~ */}
          {year ? (
            year.map((item, i) => (
              <Typography key={i} sx={{ textAlign: "center" }}>
                For year: <span style={dueDateHighlight}>{item.year}</span>
              </Typography>
            ))
          ) : (
            <Typography sx={{ textAlign: "center" }}>
              Year not available
            </Typography>
          )}
          {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
          <Card style={{ width: "50vw", margin: "0 auto" }} elevation={3}>
            <CardContent>
              <div style={{ display: "flex", flexDirection: "row", gap: 8 }}>
                <div style={{ width: "25vw" }}>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 15,
                    }}
                  >
                    <Box sx={{ display: "flex", gap: 1 }}>
                      {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
                      {/* ~~~~~~~~~ FRONT OF COUPON ~~~~~~~ */}
                      {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
                      <div
                        style={{
                          border: "1px solid #D9D9D9",
                          width: "50%",
                        }}
                      >
                        <Typography
                          variant="body2"
                          sx={{ ...grayBackground, textAlign: "center" }}
                        >
                          Front of Coupon
                        </Typography>

                        <Box
                        // sx={{
                        //   ...centeredStyle,
                        // }}
                        >
                          <FilePreview
                            directFile={file}
                            showFrontViewFiles={true}
                            showBackViewFiles={false}
                            handleDeleteFile={deleteFrontFile}
                          />
                          {frontViewFile && !isUploaded && (
                            <div>
                              <Typography variant="caption">
                                Selected File: {frontViewFile.name}
                              </Typography>
                              <Button
                                variant="contained"
                                fullWidth
                                onClick={handleFrontUpload}
                              >
                                Upload
                              </Button>
                            </div>
                          )}
                          {frontViewFile && !isUploaded ? null : (
                            <Box sx={uploadBoxStyle}>
                              <UploadFileButton
                                onFileSelect={handleFrontViewUpload}
                                title="Upload Front View PDF"
                              />
                            </Box>
                          )}
                        </Box>
                      </div>
                      {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}

                      {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
                      {/* ~~~~~~~~~ BACK OF COUPON ~~~~~~~~ */}
                      {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
                      <div
                        style={{
                          border: "1px solid #D9D9D9",
                          width: "50%",
                        }}
                      >
                        <Typography
                          variant="body2"
                          sx={{ ...grayBackground, textAlign: "center" }}
                        >
                          Back of Coupon
                        </Typography>
                        {/* <Box sx={{ ...centeredStyle }}> */}
                        <Box>
                          <FilePreview
                            directFile={file}
                            showBackViewFiles={true}
                            showFrontViewFiles={false}
                            handleDeleteFile={deleteBackFile}
                          />
                          {backViewFile && !isUploaded && (
                            <div>
                              <Typography variant="caption">
                                Selected File: {backViewFile.name}
                              </Typography>
                              <Button
                                variant="contained"
                                fullWidth
                                onClick={handleBackUpload}
                              >
                                Upload
                              </Button>
                            </div>
                          )}
                          {backViewFile && !isUploaded ? null : (
                            <Box sx={uploadBoxStyle}>
                              <UploadFileButton
                                onFileSelect={handleBackViewUpload}
                                title="Upload Back View PDF"
                              />
                            </Box>
                          )}
                        </Box>
                      </div>
                      {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
                    </Box>

                    <div>
                      <Box
                        sx={{
                          // height: "15vh",
                          backgroundColor: "rgba(96, 96, 96, 0.1)",
                        }}
                      >
                        {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
                        {/* ~~~~~~~~~~~~ STATUS ~~~~~~~~~~~~~ */}
                        {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
                        <CouponStatusDropdown
                          task={couponTask}
                          handleUpdateTask={handleUpdateTask}
                          onChange={handleChangeRequest}
                          complete={handleCompletedCoupon}
                        />
                        {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}

                        {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
                        {/* ~~~~~~~~~~ Coupon Details ~~~~~~~~~~  */}
                        {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
                        <Box sx={{ mt: 2, p: 1 }}>
                          <Box sx={flexRowSpace}>
                            <ToggleButton
                              title={
                                !showLocations
                                  ? "View Locations Accepted"
                                  : "View Coupon Details "
                              }
                              placement="top"
                              onClick={handleToggleLocations}
                              toggleState={showLocations}
                              label1="Locations"
                              label2="Details"
                            />
                            {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
                            {/* ~~~~~~~~~~ Edit Button ~~~~~~~~~~~ */}
                            <EditCouponModal
                              file={file}
                              assignedYear={assignedYear}
                            />
                            {/* {files.map((file, index) => (
                              <EditCouponModal key={index} file={file} />
                            ))} */}
                            {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
                          </Box>
                          {!showLocations && (
                            <>
                              <RenderValue label="Coupon #" value={couponId} />
                              <RenderValue
                                label="Offer"
                                value={
                                  file && file.offer !== null
                                    ? capitalizeFirstWord(file.offer)
                                    : "No offer set"
                                }
                              />
                              <RenderValue
                                label="Value"
                                value={
                                  file && file.value !== null
                                    ? `$ ${file.value}`
                                    : "No value set"
                                }
                              />
                              <RenderValue
                                label="Exclusions"
                                value={
                                  file && file.exclusions !== null
                                    ? file.exclusions
                                    : "No exclusions set"
                                }
                              />
                              <RenderValue
                                label="Expiration"
                                value={formattedDate}
                              />
                            </>
                          )}
                          {showLocations && (
                            <CouponLocations locations={files} />
                          )}
                        </Box>
                      </Box>
                    </div>
                    {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
                    {/* ~~~~~~~~~~~ BUTTONS ~~~~~~~~~~~~~ */}
                    {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
                    <CouponReviewButtons
                      onDenyButtonClick={handleDenyButtonClick}
                      isTaskUpdate={isTaskUpdate}
                      updateTaskState={updateTaskState}
                      changesRequested={changesRequested}
                      completedCoupon={completedCoupon}
                      taskId={taskId}
                      newTaskStatus={newTaskStatus}
                      taskStatus={taskStatus}
                      merchantId={merchantId}
                      setIsTaskUpdate={setIsTaskUpdate}
                      couponId={couponId}
                    />
                    {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}

                    {isModalOpen && (
                      <DenyProofModal onClose={() => setIsModalOpen(false)} />
                    )}
                  </div>
                </div>
                {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
                {/* ~~~~~~~~~~~~ COMMENTS ~~~~~~~~~~~ */}
                {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
                <CouponReviewComments
                  merchantId={merchantId}
                  onSubmit={updateComments}
                  file={file}
                  handleUploadFile={handleUploadFile}
                />
                {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
              </div>
            </CardContent>
          </Card>
          {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
        </div>
      </Box>
    </div>
  );
}
