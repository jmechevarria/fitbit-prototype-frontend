export const environment = {
  production: false,
  configRedirectURI: "http://localhost:4200/dashboard/",
  configOauthURL: "https://www.fitbit.com/oauth2/authorize",
  configScope: "heartrate sleep activity profile weight settings",
  configExpiresSec: 30 * 24 * 60 * 60, // 30 days
  baseURL: "http://localhost:4200",
  i18n: "/assets/i18n/"
};
