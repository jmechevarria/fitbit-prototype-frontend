export const environment = {
  production: true,
  configRedirectURI: "http://localhost:8080/admin/",
  configOauthURL: "https://www.fitbit.com/oauth2/authorize",
  configScope: "heartrate sleep activity profile weight settings",
  configExpiresSec: 30 * 24 * 60 * 60, // 30 days
  baseURL: "http://localhost:8080",
  i18n: "/assets/i18n/",
  apiURL: "http://localhost:3000/api/v1"
};
