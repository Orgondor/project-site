import { pixelRowToHex, pixelToHex } from "../util";

it("pixelToHex", () => {
  expect.assertions(1);
  expect(pixelToHex(new Uint8Array([0xf3, 0x6a, 0x08, 0x32]))).toEqual(
    "f36a0832"
  );
});

it("pixelRowToHex", () => {
  expect.assertions(1);
  expect(
    pixelRowToHex(
      new Uint8Array([0xf3, 0x6a, 0x08, 0x32, 0xbb, 0x12, 0x34, 0xaf])
    )
  ).toEqual("f36a0832bb1234af");
});
