import { Vendor } from "../models/vendors.model";
import { IVendor } from "../vendors.interface";

class VendorRepository {
  async updateProfile(vendorId: string, payload: Partial<IVendor>) {
    const select = Object.keys(payload);
    select.push("-_id");

    const customer = await Vendor.findByIdAndUpdate(
      vendorId,
      { $set: payload },
      { new: true }
    )
      .select(select)
      .lean();

    return customer;
  }
}

export const vendorRepo = new VendorRepository();