import crypto from "crypto";

import { DateTime } from "luxon";

class UniqueString {
  public generateUniqueString(length: number) {
    const randomBytes = crypto.randomBytes(Math.ceil(length / 2));
    const hexString = randomBytes.toString("hex").slice(0, length);
    const timestamp = DateTime.now().toUnixInteger().toString().substring(6);
    const uniqueString = `${hexString}${timestamp}`;
    return uniqueString;
  }
}

export const uniqueString = new UniqueString();