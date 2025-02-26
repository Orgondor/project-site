import { randomInt } from "../util";

it("close enough to even distribution", () => {
  expect.assertions(1);
  const amount = 10000;
  const maxValue = 5;
  const ints = Array(maxValue + 1).fill(0);

  [...Array(amount)].forEach(() => {
    const random = randomInt(maxValue);
    ints[random]++;
  });

  const min = Math.min(...ints);
  const max = Math.max(...ints);

  expect((max - min) / amount).toBeLessThan(0.02);
});
