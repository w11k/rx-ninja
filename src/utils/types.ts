/**
 * Subtracts null from a given type T
 * NonNull<number | undefined> = number
 */
export type NonNull<T> = T extends null ? never : T;

/**
 * Subtracts undefined from a given type T
 * NonUndefined<number | undefined> = number
 */
export type NonUndefined<T> = T extends undefined ? never : T;

/**
 * Subtracts null and undefined from a given type T
 * NonUndefined<number | undefined | null > = number
 */
export type NonNil<T> = T extends null | undefined ? never : T;

/**
 * Represents something that can be called with new and produces a T
 * e.g. a class
 */
export type Newable<T> = { new (...args: any[]): T; };
