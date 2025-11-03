/**
 * Capitalizes the first letter of a string.
 * @param str - The string to capitalize.
 * @param lowerRest - Whether to lowercase the rest of the string.
 * @returns The capitalized string.
 * @example
 * capitalize("fooBar") // "FooBar"
 * capitalize("fooBar", true) // "Foobar"
 */
export const capitalize = (str: string, lowerRest = false): string =>
  str
    ? str[0].toUpperCase() +
      (lowerRest ? str.slice(1).toLowerCase() : str.slice(1))
    : "";
