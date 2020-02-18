// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  configRedirectURI: "http://localhost:4200/dashboard/",
  configOauthURL: "https://www.fitbit.com/oauth2/authorize",
  configScope: "heartrate sleep activity profile weight settings",
  configExpiresSec: 30 * 24 * 60 * 60, // 30 days
  baseURL: "http://localhost:4200",
  i18n: "/assets/i18n/",
  apiURL: "http://localhost:3000/api/v1"
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
