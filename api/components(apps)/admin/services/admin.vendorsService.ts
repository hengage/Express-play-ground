import { AccountApprovalStatus, STATUS_CODES } from "../../../constants";
import { HandleException } from "../../../utils";
import { Vendor } from "../../vendors";

class AdminOpsForVendorsService {
  async getVendors(page: number) {
    const query = {};

    const options = {
      page,
      limit: 15,
      select: "firstName lastName email phoneNumber accountStatus createdAt",
      lean: true,
      leanWithId: false,
      sort: { createdAt: -1 },
    };

    const vendors = await Vendor.paginate(query, options);
    return vendors;
  }

  async getVendorDetails(vendorId: string) {
    const vendor = await Vendor.findById(vendorId)
      .select("-__v -updatedAt -location -password")
      .lean();

    if (!vendor) {
      throw new HandleException(STATUS_CODES.NOT_FOUND, "Vendor not found");
    }

    return vendor;
  }

  async getUnapprovedVendors(page: number) {
    const query = { approvalStatus: AccountApprovalStatus.PENDING };

    const options = {
      page,
      limit: 15,
      select:
        "firstName lastName email phoneNumber accountStatus approved createdAt",
      lean: true,
      leanWithId: false,
      sort: { createdAt: -1 },
    };

    const vendors = await Vendor.paginate(query, options);
    return vendors;
  }

  async approveVendor(vendorId: string) {
    const vendor = await Vendor.findById(vendorId).select("approved");
    if (!vendor) {
      throw new HandleException(STATUS_CODES.NOT_FOUND, "Vendor not found");
    }
    vendor.approvalStatus = AccountApprovalStatus.APPROVED;
    await vendor.save();
  }
}

export const adminOpsForVendorsService = new AdminOpsForVendorsService();
