export const ERRORS = {
  GENERIC_500: {
    id: 1,
    message: "SERVER_ERROR"
  },
  INVALID_USERNAME: {
    id: 2,
    message: "INVALID_USERNAME"
  },
  INCORRECT_PASSWORD: {
    id: 3,
    message: "INCORRECT_PASSWORD"
  },
  UNIQUE_CONSTRAINT: {
    id: 4,
    message: "UNIQUE_CONSTRAINT"
  },
  TOKEN_EXPIRED: {
    id: 5,
    message: "TOKEN_EXPIRED"
  },
  INSUFFICIENT_PRIVILEGES: {
    id: 6,
    message: "INSUFFICIENT_PRIVILEGES"
  }
};

export const ROLES = {
  ADMIN: 1,
  CAREGIVER: 2,
  CONTACT: 3
};

export const ACCOUNT_TYPES = {
  FITBIT: 1,
  GARMIN: 2
};

export const MESSAGE_TYPES = {
  PUSH_NOTIFICATION: 1,
  EMAIL: 2,
  TEXT_MESSAGE: 3
};
