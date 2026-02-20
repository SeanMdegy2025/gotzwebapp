/**
 * In-memory store for contact messages and bookings (dev/demo).
 * For production: use Postgres via src/lib/db when POSTGRES_URL is set.
 */

export type ContactMessage = {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  message: string;
  status: string;
  created_at: string;
  resolved_at?: string | null;
};

export type Booking = {
  id: number;
  tour_package_id: number | null;
  full_name: string;
  email: string;
  phone: string;
  whatsapp: string | null;
  travel_date: string | null;
  number_of_travelers: number;
  customization_data: object | null;
  special_requests: string | null;
  status: string;
  admin_notes?: string | null;
  completed_at?: string | null;
  created_at: string;
};

let contactIdCounter = 1;
let bookingIdCounter = 1;
const contactMessages: ContactMessage[] = [];
const bookings: Booking[] = [];

export function createContactMessage(data: Omit<ContactMessage, "id" | "created_at" | "status" | "resolved_at">): ContactMessage {
  const msg: ContactMessage = {
    ...data,
    id: contactIdCounter++,
    status: "new",
    created_at: new Date().toISOString(),
  };
  contactMessages.push(msg);
  return msg;
}

export function createBooking(data: Omit<Booking, "id" | "created_at" | "status" | "admin_notes" | "completed_at">): Booking {
  const booking: Booking = {
    ...data,
    id: bookingIdCounter++,
    status: "pending",
    created_at: new Date().toISOString(),
  };
  bookings.push(booking);
  return booking;
}

export function getTourPackageIdBySlug(_slug: string): number | null {
  return null;
}

// ---- Admin: list / get / update ----
export function getAllContactMessages(): ContactMessage[] {
  return [...contactMessages];
}

export function getContactMessageById(id: number): ContactMessage | null {
  return contactMessages.find((m) => m.id === id) ?? null;
}

export function updateContactMessageStatus(id: number, status: string): ContactMessage | null {
  const msg = contactMessages.find((m) => m.id === id);
  if (!msg) return null;
  msg.status = status;
  if (status === "closed") msg.resolved_at = new Date().toISOString();
  return msg;
}

export function getAllBookings(): Booking[] {
  return [...bookings];
}

export function getBookingById(id: number): Booking | null {
  return bookings.find((b) => b.id === id) ?? null;
}

export function updateBooking(id: number, data: { status?: string; admin_notes?: string }): Booking | null {
  const b = bookings.find((x) => x.id === id);
  if (!b) return null;
  if (data.status !== undefined) b.status = data.status;
  if (data.admin_notes !== undefined) b.admin_notes = data.admin_notes;
  if (data.status === "completed") b.completed_at = new Date().toISOString();
  return b;
}
