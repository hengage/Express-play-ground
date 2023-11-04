export enum Gender {
  Male = "Male",
  Female = "Female",
  Other = "Other",
}

export enum AccountStatus {
  Active = "Active",
  Inactive = "Inactive",
  Suspended = "Suspended",
}

export enum DriverRiderType {
  Driver = 'Driver',
  Rider = 'Rider',
}

export enum ShopCategory {
  CLOTHING = 'CLOTHING',
  PHARMACY = 'PHARMACY',
  FOOD_AND_GROCERIS = 'FOOD AND GROCERIES',
}

export enum OrderStatus  {
  PENDING = 'Pending',
  PICKED_UP = 'Picked up',
  DELIVERED = 'Delivered',
  CANCELLED = 'Cancelled'
}

export const URL_LINKS = {
  DEFAULT_SHOP_LOGO: 'DEFAULT_SHOP_LOGO',
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

