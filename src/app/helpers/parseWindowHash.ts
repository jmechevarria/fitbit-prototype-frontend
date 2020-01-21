export const parseWindowHash = <T = any>(hashString: string) => {
  if (hashString.indexOf("#") !== -1) {
    hashString = hashString.split("#")[1];

    const parts = hashString.split("&");

    const asObject = {};

    parts.forEach(part => {
      const [key, value] = part.split("=");
      asObject[key] = value;
    });

    return asObject as T;
  }

  throw new Error("No hash in url");
  //   console.log("No hash in url");
  //   return undefined;
};
