import { describe, it, expect } from "vitest";
import { formatMinor } from "../money";

describe("formatMinor", () => {
  it("formats cents as dollars", () => {
    expect(formatMinor(1999, "USD", "en-US")).toBe("$19.99");
  });

  it("formats zero", () => {
    expect(formatMinor(0, "USD", "en-US")).toBe("$0.00");
  });

  it("formats large amounts", () => {
    expect(formatMinor(100000, "USD", "en-US")).toBe("$1,000.00");
  });

  it("formats EUR", () => {
    expect(formatMinor(500, "EUR", "en-US")).toBe("€5.00");
  });
});
