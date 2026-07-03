import { Box, Dialog, IconButton, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close"; // Close icon
import { QRCodeCanvas } from "qrcode.react";
import { highlightColor } from "../Utils/colors";

const highlighted = {
  ...highlightColor,
  borderRadius: 3,
  p: 1,
};

export default function RefIdDisplay({
  seller,
  isQRcodeVisible,
  onCloseQRCode,
}) {
  const sellerUrl = `${window.location.origin}/#/seller/${seller.refId}`; // Uses current environment

  return (
    <Box sx={{ textAlign: "center" }}>
      <Typography
        variant="body1"
        noWrap
        sx={{
          fontWeight: 500,
          textAlign: "center",
          ...highlighted,
        }}
      >
        Referral ID: {seller.refId}
      </Typography>

      <Dialog
        fullScreen // Makes modal full screen
        open={isQRcodeVisible} // Controls visibility
        onClose={onCloseQRCode} // Handles backdrop/escape close
      >
        <Box
          sx={{
            height: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            p: 3,
          }}
        >
          <IconButton
            onClick={onCloseQRCode} // Closes modal
            sx={{
              position: "absolute",
              top: 16,
              right: 16,
            }}
          >
            <CloseIcon />
          </IconButton>

          <QRCodeCanvas
            value={sellerUrl} // URL encoded in QR code
            size={260} // Larger size for modal
            includeMargin // Adds quiet zone for scanning
          />

          <Typography variant="body2" sx={{ mt: 3 }}>
            Scan to support seller {seller.refId}
          </Typography>
        </Box>
      </Dialog>
    </Box>
  );
}
