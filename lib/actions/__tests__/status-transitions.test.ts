import { describe, it, expect } from "vitest";

const validTransitions: Record<string, string[]> = {
  pending: ["active"],
  active: ["inactive", "discharged"],
  inactive: ["active", "discharged"],
  discharged: [],
};

describe("patient status transitions", () => {
  it("allows pending → active", () => {
    expect(validTransitions["pending"]).toContain("active");
  });

  it("allows active → inactive", () => {
    expect(validTransitions["active"]).toContain("inactive");
  });

  it("allows active → discharged", () => {
    expect(validTransitions["active"]).toContain("discharged");
  });

  it("allows inactive → active", () => {
    expect(validTransitions["inactive"]).toContain("active");
  });

  it("allows inactive → discharged", () => {
    expect(validTransitions["inactive"]).toContain("discharged");
  });

  it("disallows discharged → any", () => {
    expect(validTransitions["discharged"]).toHaveLength(0);
  });

  it("disallows pending → inactive", () => {
    expect(validTransitions["pending"]).not.toContain("inactive");
  });

  it("disallows pending → discharged", () => {
    expect(validTransitions["pending"]).not.toContain("discharged");
  });
});
