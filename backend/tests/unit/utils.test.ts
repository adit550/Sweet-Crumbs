import { expect, test, describe } from "bun:test";
import { formatRupiah } from "../../../frontend/src/utils/formatCurrency";

describe("Utility: formatRupiah", () => {
  test("should format regular positive number correctly", () => {
    expect(formatRupiah(10000)).toBe("Rp 10.000");
    expect(formatRupiah(250000)).toBe("Rp 250.000");
  });

  test("should format zero correctly", () => {
    expect(formatRupiah(0)).toBe("Rp 0");
  });

  test("should handle negative numbers if applicable", () => {
    expect(formatRupiah(-5000)).toBe("Rp -5.000");
  });

  test("should round decimal numbers", () => {
    expect(formatRupiah(10000.5)).toBe("Rp 10.001");
    expect(formatRupiah(10000.4)).toBe("Rp 10.000");
  });

  test("should return Rp 0 for invalid inputs", () => {
    expect(formatRupiah(NaN)).toBe("Rp 0");
    expect(formatRupiah(null as any)).toBe("Rp 0");
    expect(formatRupiah(undefined as any)).toBe("Rp 0");
  });
});
