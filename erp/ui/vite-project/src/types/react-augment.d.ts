import 'react';
declare module 'react' {
  interface InputHTMLAttributes<T> {
    /** allow using <input indeterminate={...} /> without TS2322 */
    indeterminate?: boolean;
  }
}
export {};
