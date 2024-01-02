import { STATUS_CODES } from "../../../constants";
import { HandleException } from "../../../utils";
import { deleteProductsForAVendor } from "../../products";
import { shopRepository } from "../../shops/repository/shops.repo";
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

  async deleteAccount(vendorId: string) {
    const result = await Vendor.findByIdAndDelete(vendorId).select("_id");
    if (!result) {
      throw new HandleException(STATUS_CODES.NOT_FOUND, "Vendor not found");
    }
    await shopRepository.deleteShopsForAVendor(vendorId)
    await deleteProductsForAVendor(vendorId)
  }
}

export const vendorRepo = new VendorRepository();
