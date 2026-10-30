import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Booking from "@/pages/Booking";
import { api } from "@/services/api";

vi.mock("@/services/api", () => ({
  api: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
  },
}));

const mockedApi = api as unknown as {
  get: ReturnType<typeof vi.fn>;
  post: ReturnType<typeof vi.fn>;
  patch: ReturnType<typeof vi.fn>;
};

describe("Booking page", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    mockedApi.get.mockResolvedValue({ data: { services: [] } });
  });

  it("renders the booking form", () => {
    render(
      <MemoryRouter>
        <Booking />
      </MemoryRouter>
    );
    expect(screen.getByText(/Book a delivery/i)).not.toBeNull();
  });

  it("shows validation errors when required fields are empty", async () => {
    render(
      <MemoryRouter>
        <Booking />
      </MemoryRouter>
    );
    const continueBtn = screen.getByText(/Continue/i);
    fireEvent.click(continueBtn);
    expect(screen.getByText(/Name is required/i)).not.toBeNull();
    expect(screen.getByText(/Phone number is required/i)).not.toBeNull();
  });

  it("submits a valid delivery request", async () => {
    mockedApi.post.mockResolvedValue({
      data: { request: { referenceNumber: "GD-123456", status: "NEW" } },
    });
    render(
      <MemoryRouter>
        <Booking />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/Full name/i), {
      target: { value: "John Doe" },
    });
    fireEvent.change(screen.getByLabelText(/Phone number/i), {
      target: { value: "0771234567" },
    });
    fireEvent.click(screen.getByText(/Continue/i));

    expect(screen.getAllByText(/Delivery details/i).length).toBeGreaterThan(0);
  });
});
