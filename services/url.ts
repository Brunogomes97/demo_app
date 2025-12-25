export const baseURL =
  process.env.NODE_ENV === "production"
    ? process.env.API_URL
    : "http://localhost:5014/api";
