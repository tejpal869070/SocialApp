function FormatDOB(isoString) {
  if (!isoString) return "";

  const date = new Date(isoString);

  const day = String(date.getUTCDate()).padStart(2, "0");
  const month = date.toLocaleString("en-US", {
    month: "short",
    timeZone: "UTC", // Force UTC to avoid shifting
  });
  const year = date.getUTCFullYear();

  return `${day} ${month} ${year}`;
}

function CalculateAge(dobString) {
  const dob = new Date(dobString);
  const now = new Date();

  let age = now.getFullYear() - dob.getFullYear();

  const hasHadBirthdayThisYear =
    now.getMonth() > dob.getMonth() ||
    (now.getMonth() === dob.getMonth() && now.getDate() >= dob.getDate());

  if (!hasHadBirthdayThisYear) {
    age--;
  }

  return age;
}

export { FormatDOB, CalculateAge };
