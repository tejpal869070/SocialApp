function FormatDOB(isoString) {
  if (!isoString) return "";

  const date = new Date(isoString);

  const day = String(date.getUTCDate()).padStart(2, "0");
  const month = date.toLocaleString("en-US", {
    month: "short",
    timeZone: "UTC" // Force UTC to avoid shifting
  });
  const year = date.getUTCFullYear();

  return `${day} ${month} ${year}`;
}

export { FormatDOB };
