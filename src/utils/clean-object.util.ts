export function cleanObjectKeys(obj: Record<string, any>) {
  return Object.entries(obj).forEach(([key, value]) => {
    const cleanKey = key
      .replace(/\s+/g, "")
      .replace(/[^a-zA-Z0-9]/g, "")
      .toLowerCase();

    obj[cleanKey] = value;
  });
}
