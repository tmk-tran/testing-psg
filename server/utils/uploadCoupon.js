const { s3Client, PutObjectCommand } = require("../tigrisClient");

async function uploadCoupon(file, filename, bucketName = "coupons-25-26") {
  if (!file || !filename) throw new Error("File and filename are required");

  const command = new PutObjectCommand({
    Bucket: bucketName, // dynamic bucket name
    Key: filename, // name in bucket
    Body: file.buffer, // file object (from input)
    ContentType: file.mimetype, // e.g., "image/jpeg"
  });

  try {
    await s3Client.send(command);
    // Construct public URL for accessing file
    const fileUrl = `https://${bucketName}.t3.storage.dev/${encodeURIComponent(
      filename
    )}`;
    return fileUrl;
  } catch (err) {
    console.error("Upload failed", err);
    throw err;
  }
}

module.exports = { uploadCoupon };
