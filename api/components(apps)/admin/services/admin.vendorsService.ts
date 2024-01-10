import { STATUS_CODES } from "../../../constants";
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
}

export const adminOpsForVendorsService = new AdminOpsForVendorsService();
