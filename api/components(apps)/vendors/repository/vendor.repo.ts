import { STATUS_CODES } from "../../../constants";
import { HandleException } from "../../../utils";
import { Vendor } from "../models/vendors.model";
import { IVendor } from "../vendors.interface";

class VendorRepository {
  async updateProfile(vendorId: string, payload: Partial<IVendor>) {
    const select = Object.keys(payload);
    select.push("-_id");

    const vendor = await Vendor.findByIdAndUpdate(
      vendorId,
      { $set: payload },
      { new: true }
    )
      .select(select)
      .lean();

    if (!vendor) {
      throw new HandleException(STATUS_CODES.NOT_FOUND, "Vendor not found");
    }

    return vendor;
  }
}

export const vendorRepo = new VendorRepository();
