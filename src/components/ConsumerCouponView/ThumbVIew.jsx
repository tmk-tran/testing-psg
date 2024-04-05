import { Box, Typography } from "@mui/material";
// ~~~~~~~~~~ Hooks ~~~~~~~~~~~ //
import { flexRowSpace } from "../Utils/pageStyles";
// ~~~~~~~~~~ Components ~~~~~~~~~~ //
import PdfThumbnail from "../PdfThumbnail/PdfThumbnail";
import NoFile from "./NoFile";

export default function ThumbView({
  isMobile,
  mobilePreviewBox,
  previewBoxStyle,
  couponPreviewStyle,
  coupon,
}) {
  return (
    <>
      {isMobile ? (
        <Box sx={flexRowSpace}>
          {/* ~~~~~ Front View ~~~~~ */}
          <Box sx={isMobile ? mobilePreviewBox : previewBoxStyle}>
            <Typography variant="caption" sx={{ lineHeight: 1 }}>
              {isMobile ? null : "Front"}
            </Typography>
            {coupon.frontViewBlob !== null ? (
              <PdfThumbnail
                isMobile={isMobile}
                pdf={coupon.frontViewBlob}
                style={isMobile ? {} : couponPreviewStyle}
                width={isMobile ? 150 : 200}
                caseType="consumer"
              />
            ) : (
              // <NoFile label="No file available" sx={{ mt: 3 }} />
              null
            )}
          </Box>
          {/* ~~~~~ Back View ~~~~~ */}
          <Box
            sx={{
              ...(isMobile
                ? { ...mobilePreviewBox, ml: 0.25 }
                : previewBoxStyle),
            }}
          >
            {isMobile ? null : "Back"}
            {coupon.backViewBlob !== null ? (
              <PdfThumbnail
                isMobile={isMobile}
                pdf={coupon.backViewBlob}
                style={isMobile ? {} : couponPreviewStyle}
                width={isMobile ? 150 : 200}
                caseType="consumer"
              />
            ) : (
              // <NoFile label="No file available" sx={{ mt: 3 }} />
              null
            )}
          </Box>
        </Box>
      ) : (
        <>
          {/* ~~~~~ Front View ~~~~~ */}
          <Box sx={isMobile ? mobilePreviewBox : previewBoxStyle}>
            <Typography variant="caption" sx={{ lineHeight: 1 }}>
              {isMobile ? null : "Front"}
            </Typography>
            {coupon.frontViewBlob !== null ? (
              <PdfThumbnail
                isMobile={isMobile}
                pdf={coupon.frontViewBlob}
                style={isMobile ? {} : couponPreviewStyle}
                width={isMobile ? 170 : 200}
                caseType="consumer"
              />
            ) : (
              <NoFile label="No file available" sx={couponPreviewStyle} />
            )}
          </Box>
          {/* ~~~~~ Back View ~~~~~ */}
          <Box sx={isMobile ? mobilePreviewBox : previewBoxStyle}>
            {isMobile ? null : "Back"}
            {coupon.backViewBlob !== null ? (
              <PdfThumbnail
                isMobile={isMobile}
                pdf={coupon.backViewBlob}
                style={isMobile ? {} : couponPreviewStyle}
                width={isMobile ? 170 : 200}
                caseType="consumer"
              />
            ) : (
              <NoFile label="No file available" sx={couponPreviewStyle} />
            )}
          </Box>
        </>
      )}
    </>
  );
}
