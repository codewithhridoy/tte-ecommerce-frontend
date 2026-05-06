import { describe, it, expect } from "vitest";
import { unwrap, ApiError, isApiError } from "../api/envelope";

describe("unwrap", () => {
  it("returns data from success envelope", () => {
    const result = unwrap({ success: true, data: { id: "1" } });
    expect(result).toEqual({ id: "1" });
  });

  it("throws ApiError from failure envelope", () => {
    expect(() => unwrap({ success: false, error: "Bad request" })).toThrow(ApiError);
  });

  it("uses fallback message when error is missing", () => {
    let caught: Error | undefined;
    try {
      unwrap({ success: false });
    } catch (e) {
      caught = e as Error;
    }
    expect(caught?.message).toBe("Unknown error");
  });
});

describe("isApiError", () => {
  it("returns true for ApiError instances", () => {
    expect(isApiError(new ApiError("test", 400))).toBe(true);
  });

  it("returns false for plain errors", () => {
    expect(isApiError(new Error("test"))).toBe(false);
  });
});
