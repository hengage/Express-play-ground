export enum Gender {
  MALE = "male",
  FEMALE = "memale",
  OTHER = "other",
}

export enum AccountStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
  SUSPENDED = "suspended",
}

export enum DriverRiderType {
  DRIVER = "driver",
  RIDER = "rider",
}

export enum OrderStatus {
  PENDING = "pending",
  PICKED_UP = "picked_up",
  DELIVERED = "delivered",
  CANCELLED = "cancelled",
}

export enum MakuCabStatus {
  PENDING = "pending",
  ACCEPTED = "accepted",
  REJECTED = "rejected",
  ENROUTE = "enroute",
  COMPLETED = "completed",
  CANCELLED = "cancelled"
}

export const URL_LINKS = {
  DEFAULT_SHOP_LOGO: "DEFAULT_SHOP_LOGO",
  DEFAULT_ACCOUNT_PHOTO:
    "https://res.cloudinary.com/drzhdxgqk/image/upload/v1699539159/tmp-1-1699539159364_weik0e.jpg",
};

export const STATUS_CODES = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNPROCESSABLE_ENTITY: 422,
  SERVER_ERROR: 500,
  FORBIDDEN: 403,
  UNAUTHORIZED: 401,
  NOT_FOUND: 404,
  CONFLICT: 409,
};
