/**
 * Joins class names, dropping empty/false values. Lets components accept a
 * caller-supplied `className` without emitting stray whitespace.
 */
export function cx(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(' ');
}
