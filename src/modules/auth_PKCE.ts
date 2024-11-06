export const PKCE_auth = async () => {
  const generateRandomString = (length: number) => {
    const possible =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    // Creates an array of random values using cryptographic randomness
    const values = crypto.getRandomValues(new Uint8Array(length));
    // Reduces the array of random values to a string, mapping each value to a character from 'possible'
    return values.reduce((acc, x) => acc + possible[x % possible.length], "");
  };

  const codeVerifier = generateRandomString(64);
  // Stores the code verifier in local storage to be retrieved later when fetching the access token
  localStorage.setItem("code_verifier", codeVerifier);

  // Asynchronous function to hash a string using SHA-256
  const sha256 = async (plain: string) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(plain);
    // Uses the SubtleCrypto API to perform SHA-256 hashing on the encoded data
    return window.crypto.subtle.digest("SHA-256", data);
  };

  const base64encode = (input: ArrayBuffer) => {
    // Encodes the input buffer to a Base64 string and makes it URL-safe
    return btoa(String.fromCharCode(...new Uint8Array(input)))
      .replace(/=/g, "")
      .replace(/\+/g, "-")
      .replace(/\//g, "_");
  };

  const hashed = await sha256(codeVerifier);
  const codeChallenge = base64encode(hashed);

  return codeChallenge;
};
