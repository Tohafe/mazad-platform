/**
 * Generates a deterministic bidder number from a user ID.
 * The same userId will ALWAYS produce the same number.
 *
 * Uses a simple hash to generate a 4-digit number.
 */

/**
 * Simple deterministic hash (djb2) that converts a string to a number.
 */
function hashString(str: string): number {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) + hash + str.charCodeAt(i)) >>> 0; // unsigned 32-bit
  }
  return hash;
}

/**
 * Given a userId, returns a consistent pseudonym like "Bidder 1034".
 * Uses a 4-digit number (1000-9999) derived from the hash.
 * Returns "Anonymous" for null/undefined userIds.
 */
export function generatePseudonym(userId: string | null | undefined): string {
  if (!userId) return 'Anonymous';
  const hash = hashString(userId);
  // Generate a 4-digit number (1000-9999)
  const bidderNumber = 1000 + (hash % 9000);
  return `Bidder ${bidderNumber}`;
}
