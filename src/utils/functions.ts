/**
 * Alternative to Object.entries which behaves different for ES5 and ES2015+
 * compilation target in TypeScript.
 *
 * @param obj
 */
export function entries<T extends object>(obj: T): [string, any][] {
  const ownProps = Object.keys(obj);
  let i = ownProps.length;
  const resArray = new Array(i);

  while (i--) {
    resArray[i] = [ownProps[i], (obj as any)[ownProps[i]]];
  }

  return resArray;
}
