/**
 * @ovel/utils - Shared utilities for ovel packages
 */

export function noop(): void {
  // intentionally empty
}

export function identity<T>(value: T): T {
  return value;
}

export function isNonNullable<T>(value: T): value is NonNullable<T> {
  return value !== null && value !== undefined;
}
