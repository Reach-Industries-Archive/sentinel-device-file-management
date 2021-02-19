import dotenv from "dotenv";
dotenv.config();

export const SENTINEL_ENGINE_URL = process.env.SENTINEL_ENGINE_URL;
export const SENTINEL_ENGINE_FILE_FOLDER =
  process.env.SENTINEL_ENGINE_FILE_FOLDER;
export const SENTINEL_ENGINE_DEVICE_ID = process.env.SENTINEL_ENGINE_DEVICE_ID;
export const SENTINEL_ENGINE_DEVICE_AUTH_KEY =
  process.env.SENTINEL_ENGINE_DEVICE_AUTH_KEY;
export const SENTINEL_ENGINE_POLL_FREQUENCY = 5000;
