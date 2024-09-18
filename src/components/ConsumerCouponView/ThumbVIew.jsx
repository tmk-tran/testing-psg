import { Box, Typography } from "@mui/material";
// ~~~~~~~~~~ Hooks ~~~~~~~~~~~ //
import { flexRowSpace } from "../Utils/pageStyles";
// ~~~~~~~~~~ Components ~~~~~~~~~~ //
import PdfThumbnail from "../PdfThumbnail/PdfThumbnail";
import NoFile from "./NoFile";
import JpgThumbnail from "../JpgThumbnail/JpgThumbnail";

const checkFileType = (url) => ({
  isPdf: url && url.endsWith(".pdf"),
  isJpg: url && url.endsWith(".jpg"),
});

export default function ThumbView({
  isMobile,
  mobilePreviewBox,
  previewBoxStyle,
  couponPreviewStyle,
  coupon,
}) {
  // Front and Back view checks
  const frontViewType = checkFileType(coupon.frontViewUrl);
  const backViewType = checkFileType(coupon.backViewUrl);

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
            {frontViewType.isPdf ? (
              <PdfThumbnail
                isMobile={isMobile}
                pdf={coupon.frontViewUrl}
                style={isMobile ? {} : couponPreviewStyle}
                width={isMobile ? 170 : 200}
                caseType="consumer"
              />
            ) : frontViewType.isJpg ? (
              // Render JPEG Thumbnail if URL is an image
              <JpgThumbnail
                imageUrl={coupon.frontViewUrl}
                isMobile={isMobile}
              />
            ) : (
              <NoFile
                label="Image temporarily unavailable"
                sx={couponPreviewStyle}
              />
            )}
          </Box>
          {/* ~~~~~ Back View ~~~~~ */}
          {/* ~~~~~ Commented out to prevent mobile view crashing ~~~ */}
          {/* ~~~~~ Will need to switch away from PDFs before reactivating ~~~~~ */}
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
            {/* Render PDF Thumbnail if URL is a PDF */}
            {frontViewType.isPdf ? (
              <PdfThumbnail
                isMobile={isMobile}
                pdf={coupon.frontViewUrl}
                style={isMobile ? {} : couponPreviewStyle}
                width={isMobile ? 170 : 200}
                caseType="consumer"
              />
            ) : frontViewType.isJpg ? (
              // Render JPEG Thumbnail if URL is an image
              <JpgThumbnail imageUrl={coupon.frontViewUrl} />
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
            {/* Render PDF Thumbnail if URL is a PDF */}
            {backViewType.isPdf ? (
              <PdfThumbnail
                isMobile={isMobile}
                pdf={coupon.backViewUrl}
                style={isMobile ? {} : couponPreviewStyle}
                width={isMobile ? 170 : 200}
                caseType="consumer"
              />
            ) : backViewType.isJpg ? (
              // Render JPEG Thumbnail if URL is an image
              <JpgThumbnail imageUrl={coupon.backViewUrl} />
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
