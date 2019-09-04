export const environment = {
  production: true,
  config_redirect_uri: "http://localhost:4200/dashboard/",
  config_oauth_url: "https://www.fitbit.com/oauth2/authorize",
  config_scope: "heartrate sleep activity profile",
  config_expires_sec: 30 * 24 * 60 * 60, // 30 days
  secret: "3e2f3b85311ad1a16f49370ee4731be4",
  fitbitAPIApplicationID: "22B7LQ"
};
