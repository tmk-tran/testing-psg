import { Box } from "@mui/material";
import EditNoteIcon from "@mui/icons-material/EditNote";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
// ~~~~~~~ Hooks ~~~~~~~~~~~~ //
import { flexRowSpace } from "../Utils/pageStyles";
import { errorColor, primaryColor } from "../Utils/colors";
// ~~~~~~~ Components ~~~~~~~ //
import ActionButton from "../OrgSellers/ActionButton";

const editIconStyle = {
  color: primaryColor.color,
  "&:hover": {
    color: "#325CAB",
    transition: "transform 0.2s",
    cursor: "pointer",
  },
};

const deleteIconStyle = {
  color: errorColor.color,
  "&:hover": {
    color: errorColor.color,
    cursor: "pointer",
  },
  fontSize: 24,
};

export default function UserActions({ user, startEdit, handleDelete }) {
  return (
    <Box sx={flexRowSpace}>
      {user.id === 3 || user.id === 4 ? (
        <>
          <ActionButton
            title="Edit Username"
            Icon={EditNoteIcon}
            buttonSx={{ mr: 3 }}
            iconSx={editIconStyle}
            disabled={true}
            // onClick={() => startEdit(user.id)}
            // onMouseOver={(e) =>
            //   (e.currentTarget.style.transform = "scale(1.3)")
            // }
            // onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
          />

          <ActionButton
            title="Delete user"
            Icon={DeleteForeverIcon}
            iconSx={deleteIconStyle}
            disabled={true}
            // onClick={() => handleDelete(user.id)}
            // onMouseOver={(e) =>
            //   (e.currentTarget.style.transform = "scale(1.1)")
            // }
            // onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
          />
        </>
      ) : (
        <>
          <ActionButton
            title="Edit Username"
            Icon={EditNoteIcon}
            buttonSx={{ mr: 3 }}
            iconSx={editIconStyle}
            onClick={() => startEdit(user.id)}
            onMouseOver={(e) =>
              (e.currentTarget.style.transform = "scale(1.3)")
            }
            onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
          />

          <ActionButton
            title="Delete user"
            Icon={DeleteForeverIcon}
            iconSx={deleteIconStyle}
            onClick={() => handleDelete(user.id)}
            onMouseOver={(e) =>
              (e.currentTarget.style.transform = "scale(1.1)")
            }
            onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
          />
        </>
      )}
    </Box>
  );
}
