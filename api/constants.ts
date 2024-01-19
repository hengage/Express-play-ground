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
  REJECTED = "rejected",
  PROCESSING = "processing",
  TRANSIT = "in transit",
  ARRIVED = "arrived",
  DELIVERED = "delivered",
  CANCELLED = "cancelled",
}

export enum MessengerOrderStatus {
  PENDING = "pending",
  PICKED_UP = "picked up",
  ARRIVED = "arrived",
  DELIVERED = "delivered",
}

export enum MakuCabStatus {
  PENDING = "pending",
  ENROUTE_PICKUP_LOCATION = "enroute pickup location",
  ARRIVED_PICKUP_LOCATION = "arrived pick up location",
  STARTED = "started",
  COMPLETED = "completed",
  CANCELLED = "cancelled",
}

export enum TransportServiceOrderStatus {
  PENDING = "pending",
  ENROUTE_PICKUP_LOCATION = "enroute pickup location",
  ARRIVED_PICKUP_LOCATION = "arrived pick up location",
  STARTED = "started",
  COMPLETED = "completed",
  CANCELLED = "cancelled",
}

export enum WalletStatus {
  ACTIVE = "active",
  SUSPENDED = "suspended",
  CLOSED = "closed",
}

export enum Currency {
  GHANA_CEDIS = "ghs",
}

export enum WithdrawalMethod {
  MTN = "mtn",
  AIRTEL_TIGO = "airtel tigo",
  VODAFONE = "vodafone",
  CARD = "card",
}

export enum WIthdrawalFrequency {
  CLOSE_OF_DAY = "Close of day",
  EVERY_2_DAYS = "Every 2 Days",
  WEEKLY = "Weekly",
  EVERY_2_WEEKS = "Every 2 Weeks",
  MONTHLY = "Monthly",
}

export enum WithdrawalRequestStatus {
  PENDING = "Pending",
  APPROVED = "approved",
  REJECTED = "rejected",
}

export enum TransactionType {
  INFLOW = "inflow",
  OUTFLOW = "outflow",
}

export enum TransactionDescription {
  SALES = "sale",
  WITHDRAWAL = "withdrawal",
  MAKU = "maku",
  ORDER_DELIVERY = "order_delivery",
  MESSENGER_SERVICE_DELIEVERY = "messenger_service_delivery",
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
