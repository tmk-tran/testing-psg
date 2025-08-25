import { Box, Typography } from "@mui/material";
// ~~~~~~~~~~ Utils ~~~~~~~~~~~ //
import { flexRowSpace } from "../Utils/pageStyles";
// ~~~~~~~~~~ Hook ~~~~~~~~~~ //
import { useFilePreview } from "../../hooks/useFilePreview";
// ~~~~~~~~~~ Components ~~~~~~~~~~ //
import JpgThumbnail from "../JpgThumbnail/JpgThumbnail";
import NoFile from "./NoFile";
import PdfThumbnail from "../PdfThumbnail/PdfThumbnail";

export default function ThumbView({
  isMobile,
  mobilePreviewBox,
  previewBoxStyle,
  couponPreviewStyle,
  coupon,
}) {
  const { frontSrc, backSrc, frontType, backType } = useFilePreview(coupon);

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
            {frontType.isPdf ? (
              <PdfThumbnail
                isMobile={isMobile}
                pdf={frontSrc}
                style={isMobile ? {} : couponPreviewStyle}
                width={isMobile ? 170 : 200}
                caseType="consumer"
              />
            ) : frontType.isJpg ? (
              // Render JPEG Thumbnail if URL is an image
              <JpgThumbnail imageUrl={frontSrc} isMobile={isMobile} />
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
            {frontType.isPdf ? (
              <PdfThumbnail
                isMobile={isMobile}
                pdf={frontSrc}
                style={isMobile ? {} : couponPreviewStyle}
                width={isMobile ? 170 : 200}
                caseType="consumer"
              />
            ) : frontType.isJpg ? (
              // Render JPEG Thumbnail if URL is an image
              <JpgThumbnail imageUrl={frontSrc} />
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
            {backType.isPdf ? (
              <PdfThumbnail
                isMobile={isMobile}
                pdf={backSrc}
                style={isMobile ? {} : couponPreviewStyle}
                width={isMobile ? 170 : 200}
                caseType="consumer"
              />
            ) : backType.isJpg ? (
              // Render JPEG Thumbnail if URL is an image
              <JpgThumbnail imageUrl={backSrc} />
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
