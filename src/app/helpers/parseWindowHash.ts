export const parseWindowHash = <T = any>(unformattedHashString: string) => {
  if (unformattedHashString.indexOf("#") !== -1) {
    unformattedHashString = unformattedHashString.split("#")[1];

    const parts = unformattedHashString.split("&");

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
