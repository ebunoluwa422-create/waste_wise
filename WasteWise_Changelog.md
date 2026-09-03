# WasteWise Changelog

All notable changes to the WasteWise project are documented in this file.

---

## [Unreleased / Latest]

### Security
- Moved admin authentication from the frontend to the backend. The admin password is no longer visible in client-side code and is now validated server-side against an environment variable.

### Changed
- Removed the "No card required to get started" note from the homepage hero section.
- Removed the static, non-functional live pickup preview card from the homepage hero.

### Removed
- Removed the "Nearby drop-off points" feature from the user dashboard, including its associated map toggle and category-based location data, as it did not match the app's collection model (pickup, not drop-off).
- Removed the "Recycling locator" quick-action button and homepage feature card, as the underlying feature was removed.

---

## [Deployment: Render Migration]

### Changed
- Migrated the full application from a two-service Vercel deployment (separate frontend/backend) to a single-service Render deployment, with Express serving both the built React frontend and the API.
- Migrated the database from local MySQL (XAMPP) to a cloud-hosted PostgreSQL instance on Render.
- Rewrote the database connection layer (`db.js`) from `mysql2` to `pg` with a connection pool.
- Converted all SQL queries from MySQL placeholder syntax (`?`) to PostgreSQL syntax (`$1, $2, ...`), and updated insert-ID retrieval accordingly.
- Recreated the full database schema (`users`, `otps`, `payments`, `pickups`, `messages`) on the new PostgreSQL database via a one-time setup script.

### Fixed
- Fixed an Express 5 breaking change in the wildcard route (`app.get('*', ...)` → `app.get('/*splat', ...)`) that was preventing the app from starting.
- Fixed a missing `public` folder in version control that was causing production builds to fail (folder was present locally but had never been committed to Git).
- Fixed incorrect environment variable file location (`.env` needed to live inside `backend/`, matching where the server process runs).

### Security
- Identified and remediated an exposed Gmail app password that had been hardcoded in source code. The compromised credential was revoked, a replacement was generated, and it was migrated to an environment variable.

---

## [Deployment: Initial Multi-Service Setup]

### Added
- Configured a multi-service deployment (`vercel.json`) routing frontend and backend through a single domain, with `/api/*` requests routed to the backend and all other requests routed to the frontend.
- Added an `entrypoint` configuration so Vercel could correctly run the custom Express server.

### Fixed
- Fixed incorrect file placement in the repository (`api` folder and `vercel.json` repeatedly nested inside `src` instead of at the project root).
- Fixed hardcoded `localhost` API URLs in the React frontend, replacing them with environment-aware relative `/api/...` paths so the same code works in both local development and production.
- Fixed a missing `/api` prefix-stripping rule that caused deployed API requests to 404 (Express routes were defined without the `/api` prefix).

---

## [Feature: Email Delivery]

### Changed
- Diagnosed and began migrating email delivery from SMTP (Nodemailer via Gmail) to an HTTP-based email API (Brevo), after identifying that:
  - Restrictive local/campus network configurations were blocking outbound SMTP ports.
  - Render's free tier blocks outbound SMTP traffic (ports 25, 465, 587) as a platform-wide policy.

---

## [Feature: OTP Email Verification]

### Added
- Built a complete OTP-based email verification system for signup, including:
  - A new `otps` database table with expiry tracking.
  - `/send-otp` and `/verify-otp` backend routes.
  - A frontend verification step inserted into the signup flow.

### Changed
- OTP verification is currently suspended in the live signup flow (per instructor guidance) in favor of direct registration, but remains fully built and available for future re-activation.

---

## [Core Application]

### Added
- User registration and login with bcrypt password hashing.
- Waste category selection (Organic, Plastic, Paper, Glass, Metal, Hazardous).
- Pickup scheduling with date, time window, and waste type.
- Payment flow integrated with Paystack.
- Live pickup status tracking (Scheduled → En Route → Arrived → Collected).
- User dashboard with recent activity, next payment, and pickup history.
- Admin dashboard with full user list, full pickup list, and per-user messaging (delivered in-app and by email).
- Landing page with product overview, how-it-works section, and category browser.

### Design
- Initial system algorithm and user flowchart established, covering the full journey from app launch through payment, tracking, completion, and rating.

---

## [Documentation]

### Added
- Comprehensive project documentation (system architecture, database schema, API reference, deployment details).
- End-user guide covering account creation, scheduling, payment, tracking, and admin features.
- Frequently Asked Questions covering account, scheduling, payment, tracking, and troubleshooting topics.
- Privacy Policy.
- Terms of Use.
- This changelog.
