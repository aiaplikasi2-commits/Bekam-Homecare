# Security Specification for Terapis Bekam & Pijat Panggilan

## Data Invariants
1. `therapistProfile`: Single document containing therapist bio, photo, certificates, expertise, vision, mission, and banner settings. Public readable, writeable only by authenticated admin (`request.auth != null`).
2. `services`: Collection of services offered. Public readable, writeable only by authenticated admin.
3. `activities`: Collection of mini social feed activities. Public readable, writeable only by authenticated admin.
4. `gallery`: Collection of gallery items. Public readable, writeable only by authenticated admin.
5. `articles`: Collection of articles/blog posts. Public can read published articles (`isDraft == false`), admin can read/write all.
6. `testimonials`: Collection of customer testimonials. Public readable, writeable only by authenticated admin.
7. `bookings`: Collection of appointment bookings. Anyone can create a booking with valid required fields. Authenticated admin can read, list, update status, or delete bookings.
8. `serviceAreas`: Collection of coverage areas. Public readable, writeable only by authenticated admin.
9. `contactInfo`: Single document or collection for contact links & social media. Public readable, writeable only by authenticated admin.
10. `visitorStats`: Counter document for visitor statistics. Can be incremented by visitors or updated by admin.

## "Dirty Dozen" Security Violations Shielded
1. Unauthenticated users creating fake services.
2. Unauthenticated users modifying therapist profile or banner details.
3. Users injecting invalid/massive string payloads into document IDs.
4. Unauthenticated users deleting client bookings.
5. Clients modifying booking status to 'completed' without admin approval.
6. Malicious users overwriting article published states.
7. Unauthenticated users changing contact details or WhatsApp numbers.
8. Unauthenticated access to unpublished draft articles.
9. Injection of unauthorized custom fields into booking documents.
10. Spoofed client timestamps.
11. Bypassing email/auth check on admin operations.
12. Unbounded string/array payload resource exhaustion.
