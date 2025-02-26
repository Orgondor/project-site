import { pixelToInt } from "../util";

describe("pixelToInt", () => {
  it("correct conversion", () => {
    expect.assertions(1);
    expect(pixelToInt(new Uint8Array([0xf3, 0x6a, 0x08, 0x32]))).toEqual(
      0xf36a0832
    );
  });

  it("correct conversion, more data", () => {
    expect.assertions(1);
    expect(
      pixelToInt(
        new Uint8Array([0xb0, 0x0b, 0x51, 0x01, 0xf3, 0x6a, 0x08, 0x32])
      )
    ).toEqual(0xb00b5101);
  });

  it("correct conversion, more data", async () => {
    expect.assertions(1);
    await expect(() => pixelToInt(new Uint8Array([0x13, 0x37, 0xee]))).toThrow(
      "invalid pixel, length < 4"
    );
  });
});
