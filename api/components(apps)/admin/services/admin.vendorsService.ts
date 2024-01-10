import { Vendor } from "../../vendors";

class AdminOpsForVendorsService {
    async getVendors(page: number) {
        const query = {}

        const options = {
            page,
            limit: 15,
            select: "firstName lastName email phoneNumber accountStatus createdAt",
            lean: true,
            leanWithId: false,
            sort: { createdAt: -1 },
          };

          const vendors = await Vendor.paginate(query, options)
          return vendors
    }
}

export const adminOpsForVendorsService = new AdminOpsForVendorsService();