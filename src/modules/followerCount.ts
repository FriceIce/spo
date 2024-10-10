const followers = (followers: number) => {
  if (followers < 1000) return String(followers); // Return the number as a string if less than 1000

  const suffixes = ["k", "M", "B"];
  let index = Math.floor(Math.log10(followers) / 3); // Determine the index for suffix

  // Calculate the value by dividing by the corresponding power of 1000
  const value = (followers / Math.pow(1000, index)).toFixed(index > 0 ? 1 : 0);

  return `${value}${suffixes[index - 1]}`; // Use index - 1 to get the correct suffix
};

export default followers;
