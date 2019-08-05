import { assert } from "chai";
import { from, of } from "rxjs";
import { first, tap } from "rxjs/operators";
import { isInstanceOf, onlyInstancesOf } from "./only-instances-of";

class Class1 { a: boolean | undefined; }
class Class2 { b: number | undefined; }

describe("isInstanceOf", function () {

  it("should return true", function () {
    const instanceOf1 = isInstanceOf(Class1);
    const is1 = instanceOf1(new Class1());

    assert.isTrue(is1);
  });

  it("should return false", function () {
    const instanceOf2 = isInstanceOf(Class2);
    const is2 = instanceOf2(new Class1());

    assert.isFalse(is2);
  });

});

describe("onlyInstancesOf", function () {

  it("should filter Class2 and pass Class1", async function () {

    const aOrB$ = from([new Class2(), new Class1()]);

    const firstValue = await aOrB$
        .pipe(
            onlyInstancesOf(Class1),
            first(), // let rxjs throw an error if no event passed
        )
        .toPromise();

    assert.isTrue(firstValue instanceof Class1);
  });

});
