import { assert } from "chai";
import { of } from "rxjs";
import { filter, first, tap } from "rxjs/operators";
import { isPathNotNil, skipPathNil } from "./skip-path-nil";

const obj_9: { a?: { b?: { c?: { d?: { e?: string | null } | null } | null } | null } | null } = {
  a: { b: { c: { d: { e: "e" } } } }
};

describe("isPathNotNil", function () {
  it("should compile and pass array of object with just values", function () {
    [obj_9]
        .filter(isPathNotNil("a", "b", "c", "d", "e"))
        .forEach(x => {
          assert.equal(x.a.b.c.d.e, "e");
        });

    let b: object | undefined;
    if (isPathNotNil(obj_9, "a", "b")) {
      b = obj_9.a.b;
    }
    assert.equal(typeof b, "object");
  });

  it("should compile and pass direct call with object with just values", function () {
    let e: string | undefined;
    if (isPathNotNil(obj_9, "a", "b", "c", "d", "e")) {
      e = obj_9.a.b.c.d.e;
    }

    assert.equal(e, "e");
  });

  it("should filter object with null", function () {
    const testObj = {
      a: { b: null }
    };

    const filtered = [testObj]
        .filter(isPathNotNil("a", "b"));

    assert.isTrue(filtered.length === 0);
    assert.isFalse(isPathNotNil(testObj, "a", "b"));
  });

  it("should filter object with undefined", function () {
    const testObj = {
      a: { b: undefined }
    };

    const filtered = [testObj]
        .filter(isPathNotNil("a", "b"));

    assert.isTrue(filtered.length === 0);
    assert.isFalse(isPathNotNil(testObj, "a", "b"));
  });
});

describe("skipPathNil", function () {

  it("should compile and pass object with just values", async function () {
    const testObj$ = of(obj_9);

    const completion = testObj$
    // functional test
        .pipe(
            skipPathNil("a", "b", "c", "d", "e"),
            first(), // let rxjs throw error on completion without previous value
        )
        // just for compiler check
        .pipe(
            tap(x => x.a.b.c.d.e.charAt(0)),
        )
        .forEach(x => {
          assert.equal(x, obj_9);
        });

    await completion;
  });

  it("should skip object with null", async function () {
    const testObj = {
      a: { b: null as string | null }
    };

    const testObj$ = of(testObj);

    const completion = testObj$
        // functional test
        .pipe(
            skipPathNil("a", "b")
        )
        // compile time check
        .pipe(
            tap(x => x.a.b.charAt(0)),
        )
        .forEach(x => {
          throw new Error(`shouldn't run here, object should be filtered, x is "${JSON.stringify(x)}"`);
        });

    await completion;
  });

  it("should skip object with undefined", async function () {
    const testObj = {
      a: { b: undefined as string | undefined }
    };

    const testObj$ = of(testObj);

    const completion = testObj$
        // functional test
        .pipe(
            filter(isPathNotNil("a", "b")),
            // filterPathNotNil("a", "b")
            // onlyPathNotNil("a", "b")
            skipPathNil("a", "b")
        )
        // compile time check
        .pipe(
            tap(x => x.a.b.charAt(0)),
        )
        .forEach(x => {
          throw new Error(`shouldn't run here, object should be filtered, x is "${JSON.stringify(x)}"`);
        });

    await completion;
  });

  it("should skip object without optional value", async function () {
    const testObj: { a? : { b?: string } } = {};

    const testObj$ = of(testObj);

    const completion = testObj$
        // functional test
        .pipe(
            skipPathNil("a", "b"),
        )
        // compile time check
        .pipe(
            tap(x => x.a.b),
        )
        .forEach(x => {
          throw new Error(`shouldn't run here, object should be filtered, x is "${JSON.stringify(x)}"`);
        });

    await completion;
  });

});
