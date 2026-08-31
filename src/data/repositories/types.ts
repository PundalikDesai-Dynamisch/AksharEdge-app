/**
 * Shared vocabulary for every repository interface.
 *
 * Nothing in this folder may reference Firebase. If a Firestore type ever appears here, the
 * seam has already leaked and swapping to a Node API stops being a one-folder change.
 */

/**
 * Cancels a live subscription. Deliberately a bare function rather than an RxJS Subscription or
 * a Firestore-shaped object: it is `onSnapshot` today and could be a WebSocket or a poll
 * tomorrow, and the interface should not say which.
 */
export type Unsubscribe = () => void;

/** Delivered on every change, including the first load. */
export type Observer<T> = (value: T) => void;

/** A live subscription reports failures out-of-band, since there is no promise to reject. */
export type ErrorObserver = (error: unknown) => void;
