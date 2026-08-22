import { expect, test, describe } from "bun:test";
import { calculateSubtotal, calculateDelivery, calculateTotal } from "../../../frontend/src/utils/cartCalculations";

describe("Order Calculation (Cart)", () => {
  test("should calculate subtotal correctly for 1 item", () => {
    const items = [
      { price: 15000, quantity: 1 }
    ];
    expect(calculateSubtotal(items)).toBe(15000);
  });

  test("should calculate subtotal correctly for multiple items with different quantities", () => {
    const items = [
      { price: 10000, quantity: 2 },
      { price: 25000, quantity: 1 },
      { price: 5000, quantity: 3 }
    ];
    // 20000 + 25000 + 15000 = 60000
    expect(calculateSubtotal(items)).toBe(60000);
  });

  test("should calculate subtotal correctly for empty order", () => {
    const items: any[] = [];
    expect(calculateSubtotal(items)).toBe(0);
  });

  test("should handle invalid negative prices gracefully", () => {
    const items = [
      { price: -10000, quantity: 2 }
    ];
    expect(calculateSubtotal(items)).toBe(-20000);
  });

  test("should calculate delivery fee correctly", () => {
    // subtotal > 0
    expect(calculateDelivery(10000)).toBe(15000);
    // subtotal = 0
    expect(calculateDelivery(0)).toBe(0);
    // negative subtotal (should theoretically not have delivery fee)
    expect(calculateDelivery(-5000)).toBe(0);
  });

  test("should calculate total correctly", () => {
    // subtotal: 60000, discount: 5000, delivery: 15000
    expect(calculateTotal(60000, 5000, 15000)).toBe(70000);
    
    // zero subtotal
    expect(calculateTotal(0, 0, 0)).toBe(0);
  });
});
