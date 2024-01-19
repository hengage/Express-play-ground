import { WalletStatus } from "../../../constants";
import { DriverRider } from "../../driversAndRiders";
import { Vendor } from "../../vendors";
import { Wallet } from "../models/wallet.models";

class WalletRepository {
  async create(payload: any) {
    const wallet = await Wallet.create({
      user: payload.user,
    });

    return wallet;
  }

  async createWalletForVendors() {
    try {
      const vendors = await Vendor.find();
      //   console.log({ vendors, vendorsCount: vendors.length });

      vendors.forEach(async (vendor) => {
        const wallet = await Wallet.findOne({ user: vendor._id });
        console.log({ foundWallet: wallet });
        if (!wallet) {
          const newWallet = await Wallet.create({ user: vendor._id });
          console.log("Created wallet", newWallet);
        }
      });
    } catch (error: any) {
      console.log(error);
    }
  }

  async createWalletForRiders() {
    try {
      const driversAndRiders = await DriverRider.find();
      //   console.log({ vendors, vendorsCount: vendors.length });

      driversAndRiders.forEach(async (account) => {
        const wallet = await Wallet.findOne({ user: account._id });
        console.log({ foundWallet: wallet });
        if (!wallet) {
          const newWallet = await Wallet.create({ user: account._id });
          console.log("Created wallet", newWallet);
        }
      });
    } catch (error: any) {
      console.log(error);
    }
  }
}

export const walletRepo = new WalletRepository();
