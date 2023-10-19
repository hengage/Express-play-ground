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
  Healthcare = "HEALTHCARE",
  Boutique = 'BOUTIQUE',
  Pharmacy = 'PHARMACY',
  FoodAndGroceries = 'FOOD AND GROCERIES',
}

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