import { randomPixelRow } from "./testHelpers";
import { pixelRowEqual } from "../util";

describe("pixelRowEqual", () => {
  const array1: number[] = randomPixelRow(4);
  const array2: number[] = randomPixelRow(4);

  it("number[] === number[]", () => {
    expect.assertions(1);
    expect(pixelRowEqual(array1, [...array1])).toEqual(true);
  });

  it("Uint8Array === Uint8Array", () => {
    expect.assertions(1);
    expect(
      pixelRowEqual(new Uint8Array(array1), new Uint8Array(array1))
    ).toEqual(true);
  });

  it("number[] === Uint8Array", () => {
    expect.assertions(1);
    expect(pixelRowEqual(array1, new Uint8Array(array1))).toEqual(true);
  });

  it("Uint8Array === number[]", () => {
    expect.assertions(1);
    expect(pixelRowEqual(new Uint8Array(array1), array1)).toEqual(true);
  });

  it("number[] !== number[]", () => {
    expect.assertions(1);
    expect(pixelRowEqual(array1, array2)).toEqual(false);
  });

  it("Uint8Array !== Uint8Array", () => {
    expect.assertions(1);
    expect(
      pixelRowEqual(new Uint8Array(array1), new Uint8Array(array2))
    ).toEqual(false);
  });

  it("number[] !== Uint8Array", () => {
    expect.assertions(1);
    expect(pixelRowEqual(array1, new Uint8Array(array2))).toEqual(false);
  });

  it("Uint8Array !== number[]", () => {
    expect.assertions(1);
    expect(pixelRowEqual(new Uint8Array(array1), array2)).toEqual(false);
  });

  it("length !== length", () => {
    expect.assertions(1);
    expect(pixelRowEqual(array1, [...array1, 0])).toEqual(false);
  });
});
