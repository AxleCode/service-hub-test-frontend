// auth
export const auth = {
  token: "token",
  token_expired: "token_expired",
  refresh_token: "refresh_token",
  refresh_token_expired: "refresh_token_expired",
  logged_in: "logged_in",
};

// auth state
export const state = {
  loggedIn: "1",
};

// response
export const responses = {
  success: "Success",

  // token handling
  unauthorizedToken: "Unauthorized token",
  unauthorizedRefreshToken: "Unauthorized refresh token",
  pleaseLoginFirst: "Please login first",
};

// services
export const services = {
  auth: "/auth-service",
  hr: "/hr-services",
};
