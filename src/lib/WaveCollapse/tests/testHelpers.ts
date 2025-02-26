import { randomInt } from "crypto";

export const randomPixel = (): number[] => {
  return [randomInt(0xff), randomInt(0xff), randomInt(0xff), randomInt(0xff)];
};

export const randomPixelRow = (size: number): number[] => {
  const result: number[] = [];
  [...Array(size)].forEach(() => {
    randomPixel().forEach((value) => {
      result.push(value);
    });
  });
  return result;
};
