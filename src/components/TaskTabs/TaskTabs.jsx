import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
// ~~~~~~~~~~ Style ~~~~~~~~~~
import { Tab, Tabs, Box, Typography } from "@mui/material";
import AddBoxIcon from "@mui/icons-material/AddBox";
// ~~~~~~~~~~ Components ~~~~~~~~~~
import TaskListOrg from "../TaskList/TaskListOrg";
import TaskListMerchant from "../TaskList/TaskListMerchant";
import NewTaskModal from "../NewTaskModal/NewTaskModal";
import NewBookYear from "../NewBookYear/NewBookYear";
import SuccessAlert from "../SuccessAlert/SuccessAlert";
// ~~~~~~~~~~ Hooks ~~~~~~~~~~
import { dispatchHook } from "../../hooks/useDispatch";
import { User, mTasks } from "../../hooks/reduxStore";
import { useAlert } from "../SuccessAlert/useAlert";
import { tabWidth } from "../Utils/helpers";

export const spinnerSx = {
  ml: 1,
  verticalAlign: "middle",
};

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export default function BasicTabs() {
  const dispatch = dispatchHook();
  const [value, setValue] = useState(0);
  const [merchantTab, setMerchantTab] = useState(false);
  const [activeTab, setActiveTab] = useState("organization"); // Set the default tab
  const [isLoading, setIsLoading] = useState(true);
  // ~~~~~~~~~~ Alert ~~~~~~~~~~ //
  const { isAlertOpen, handleAlertClose, handleTaskUpdate } = useAlert();
  // ~~~~~~~~~~ Store ~~~~~~~~~~ //
  const user = User();
  const merchantTasks = mTasks() || [];

  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  useEffect(() => {
    // Dispatch actions based on the active tab
    if (activeTab === "organization") {
      dispatch({ type: "FETCH_ALL_ORGANIZATION_TASKS" });
    } else if (activeTab === "merchant") {
      dispatch({ type: "FETCH_ALL_MERCHANT_TASKS" });
    }
  }, [activeTab]);

  // Set isLoading to false when the tasks are loaded
  useEffect(() => {
    if (merchantTasks.length > 0) {
      setIsLoading(false);
    } else if (merchantTasks.length === 0) {
      setIsLoading(false);
    }
  }, [merchantTasks]);
  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  const handleLoadingComplete = () => {
    setIsLoading(false);
  };

  const styleTaskHeaders = {
    fontWeight: "bold",
    mb: 5,
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
    setMerchantTab(false);
  };

  const handleMerchantTab = () => {
    setActiveTab("merchant");
    setMerchantTab(true);
  };

  return (
    <>
      <SuccessAlert
        isOpen={isAlertOpen}
        onClose={handleAlertClose}
        caseType="NewTask"
      />
      <Box
        sx={{
          width: "60vw",
          margin: "0 auto",
          // height: "80vh",
          padding: "35px",
        }}
      >
        {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
        {/* ~~~~~~~~~~~~~~ Page Header ~~~~~~~~~~~~~~ */}
        {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
        <Typography
          variant="h5"
          sx={{ textAlign: "center", ...styleTaskHeaders }}
        >
          Task Management
        </Typography>
        {/* ~~~~~~~~~~~~~~~~ END ~~~~~~~~~~~~~~~~~~~~ */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: 1,
            borderColor: "divider",
            marginBottom: 3,
            paddingY: 2,
          }}
        >
          {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
          {/* ~~~~~~~~~~~~~~ Tab Headers ~~~~~~~~~~~~~~ */}
          {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
          <Tabs
            value={value}
            // value={currentTab}
            onChange={handleChange}
            aria-label="basic tabs example"
          >
            <Tab
              label="Organization"
              {...a11yProps(0)}
              sx={tabWidth}
              // onClick={() => setMerchantTab(false)}
              onClick={() => setActiveTab("organization")}
            />
            <Tab
              label="Merchant"
              {...a11yProps(1)}
              // onClick={() => setMerchantTab(true)}
              onClick={handleMerchantTab}
              sx={tabWidth}
            />
            {user.is_admin && (
              <Tab
                label="Coupon Book"
                {...a11yProps(2)}
                onClick={() => setActiveTab("book year")}
              />
            )}
          </Tabs>
          <NewTaskModal
            tabs={true}
            customIcon={<AddBoxIcon />}
            customText="Task"
            merchantTab={merchantTab}
            onChange={handleTaskUpdate}
            disabled={activeTab === "book year" ? true : false}
          />
          {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
        </Box>
        {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
        {/* ~~~~~~~~~~~~~~ Tab Body ~~~~~~~~~~~~~~ */}
        {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
        <TabPanel value={value} index={0}>
          <TaskListOrg
            isLoading={isLoading}
            loadComplete={handleLoadingComplete}
          />
        </TabPanel>

        <TabPanel value={value} index={1}>
          <TaskListMerchant
            isLoading={isLoading}
            setIsLoading={setIsLoading}
            loadComplete={handleLoadingComplete}
          />
        </TabPanel>
        {/* ~~~~~~~~~~~~~~~~ END ~~~~~~~~~~~~~~~~~~~~ */}

        {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
        {/* ~~~~~~~~~~~~ Coupon Book Year ~~~~~~~~~~ */}
        {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
        <TabPanel value={value} index={2}>
          <NewBookYear />
        </TabPanel>
        {/* ~~~~~~~~~~~~~~~~ END ~~~~~~~~~~~~~~~~~~~~ */}
      </Box>
    </>
  );
}
