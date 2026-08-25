/** Whole-dollar price display, e.g. 24 -> "$24". */
export function formatPrice(amount: number): string {
  return `$${amount}`;
}

/** "1 item" / "2 items" — count plus its correctly pluralized noun. */
export function pluralize(count: number, noun: string, plural = `${noun}s`): string {
  return `${count} ${count === 1 ? noun : plural}`;
}
