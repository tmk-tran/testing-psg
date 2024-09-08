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
      {/* ~~~~~ MOBILE VIEW ~~~~~ */}
      {isMobile ? (
        <Box sx={flexRowSpace}>
          {/* ~~~~~ Front View ~~~~~ */}
          <Box sx={isMobile ? mobilePreviewBox : previewBoxStyle}>
            <Typography variant="caption" sx={{ lineHeight: 1 }}>
              {isMobile ? null : "Front"}
            </Typography>
            {coupon.frontViewBlob !== null ? ( // in PROD, this is frontViewUrl
              <PdfThumbnail
                isMobile={isMobile}
                pdf={coupon.frontViewBlob} // in PROD, this is frontViewUrl
                style={isMobile ? {} : couponPreviewStyle}
                width={isMobile ? 150 : 200}
                caseType="consumer"
              />
            ) : null}
          </Box>
          {/* ~~~~~ Back View ~~~~~ */}
          {/* <Box
            sx={{
              ...(isMobile
                ? { ...mobilePreviewBox, ml: 0.25 }
                : previewBoxStyle),
            }}
          >
            {isMobile ? null : "Back"}
            {coupon.backViewBlob !== null ? ( // in PROD, this is backViewUrl
              <PdfThumbnail
                isMobile={isMobile}
                pdf={coupon.backViewBlob} // in PROD, this is backViewUrl
                style={isMobile ? {} : couponPreviewStyle}
                width={isMobile ? 150 : 200}
                caseType="consumer"
              />
            ) : null}
          </Box> */}
        </Box>
      ) : (
        <>
          {/* ~~~~~ Front View ~~~~~ */}
          <Box sx={isMobile ? mobilePreviewBox : previewBoxStyle}>
            <Typography variant="caption" sx={{ lineHeight: 1 }}>
              {isMobile ? null : "Front"}
            </Typography>
            {coupon.frontViewBlob !== null ? ( // in PROD, this is frontViewUrl
              <PdfThumbnail
                isMobile={isMobile}
                pdf={coupon.frontViewBlob} // in PROD, this is frontViewUrl
                style={isMobile ? {} : couponPreviewStyle}
                width={isMobile ? 170 : 200}
                caseType="consumer"
              />
            ) : (
              <NoFile
                label="Image temporarily unavailable"
                sx={couponPreviewStyle}
              />
            )}
          </Box>
          {/* ~~~~~ Back View ~~~~~ */}
          <Box sx={isMobile ? mobilePreviewBox : previewBoxStyle}>
            {isMobile ? null : "Back"}
            {coupon.backViewBlob !== null ? ( // in PROD, this is backViewUrl
              <PdfThumbnail
                isMobile={isMobile}
                pdf={coupon.backViewBlob} // in PROD, this is backViewUrl
                style={isMobile ? {} : couponPreviewStyle}
                width={isMobile ? 170 : 200}
                caseType="consumer"
              />
            ) : (
              <NoFile
                label="Image temporarily unavailable"
                sx={couponPreviewStyle}
              />
            )}
          </Box>
        </>
      )}
    </>
  );
}
