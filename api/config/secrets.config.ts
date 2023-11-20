export const  DB_URL = process.env.DB_URL
export const NODE_ENV = process.env.NODE_ENV || 'development'
export const PORT = process.env.PORT || 4000
export const SECRET_KEY = process.env.SECRET_KEY

export const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME
export const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY
export const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET

export const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID
export const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN
export const TWILIO_PHONE_NUMBER = process.env.TWILIO_PHONE_NUMBER
export const TWILIO_VERIFY_SID = process.env.TWILIO_VERIFY_SID

export const REDIS_PASSWORD = process.env.REDIS_PASSWORD
export const REDIS_HOST = process.env.REDIS_HOST
export const REDIS_PORT = parseInt(`${process.env.REDIS_PORT}`)