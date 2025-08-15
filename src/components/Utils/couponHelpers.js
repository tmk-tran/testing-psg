/**
 * Formats coupon objects into a consistent structure
 * @param {Array} files - Array of coupon objects from API or DB
 * @returns {Array} - Array of formatted coupon objects
 */

export const formatCoupons = (files = []) => {
  if (!Array.isArray(files)) return [];
  return files.map((coupon) => ({
    id: coupon.id ?? null,
    merchantId: coupon.merchant_id ?? null,
    is_deleted: coupon.is_deleted ?? false,
    frontViewBlob: null,
    backViewBlob: null,
    offer: coupon.offer ?? "",
    value: coupon.value ?? "",
    exclusions: coupon.exclusions ?? "",
    expiration: coupon.expiration ?? null,
    additionalInfo: coupon.additional_info ?? "",
    taskId: coupon.task_id ?? null,
    bookId: coupon.book_id ?? null,
    locationId: coupon.location_id ?? null,
    locationName: coupon.location_name ?? "",
    phoneNumber: coupon.phone_number ?? "",
    address: coupon.address ?? "",
    city: coupon.city ?? "",
    state: coupon.state ?? "",
    zip: coupon.zip ?? "",
    locationMerchantId: coupon.location_merchant_id ?? null,
    additionalDetails: coupon.location_additional_details ?? "",
    merchantName: coupon.merchant_name ?? "",
    frontViewUrl: coupon.filename_front ?? "",
    backViewUrl: coupon.filename_back ?? "",
  }));
};
