import { Box, IconButton, Tooltip } from "@mui/material";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
// ~~~~~~~~~~ Hooks ~~~~~~~~~~ //
import { flexRowSpace, flexCenter } from "../Utils/pageStyles";
import { errorColor } from "../Utils/colors";
// ~~~~~~~~~~ Components ~~~~~~~~~~ //
import OrgMenu from "./OrgMenu";

export default function ({
  orgAdmins,
  row,
  allOrgs,
  handleOrgSelect,
  removeOrg,
  setAddNewOrg,
}) {
  return (
    <>
      {orgAdmins
        .filter((admin) => admin.user_id === row.id) // Filter orgAdmins for the current user
        .map((admin) => {
          const organization = allOrgs.find((org) => org.id === admin.org_id); // Find the organization details
          return organization ? (
            <Box sx={flexRowSpace} key={organization.id}>
              <OrgMenu
                userId={row.id}
                organizations={allOrgs}
                defaultValue={organization.id}
                onChange={handleOrgSelect}
                setAddNewOrg={setAddNewOrg}
              />
              <Box sx={flexCenter}>
                <Tooltip title="Remove OrgAdmin status">
                  <IconButton
                    aria-label="Remove"
                    onClick={() => removeOrg(row.id, organization.id)}
                  >
                    <RemoveCircleIcon
                      sx={{ fontSize: 16, color: errorColor.color }}
                    />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>
          ) : null;
        })}
    </>
  );
}
