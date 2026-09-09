# Changelog

All notable changes to VIPHive are documented here.

## [0.1.1] - 2026-09-10

### Added

- Six-box OTP verification with automatic submission, resend cooldown, paste support, and API error feedback.
- GitHub Actions CI checks for staging, main, and master branches.

### Fixed

- Removed the duplicate misspelled OTP route and prevented duplicate OTP API requests.

## [Unreleased]

### Added

- GitHub Actions CI checks for linting and production builds.
- Environment-aware application logging documentation.
- A dedicated `/verify-otp` screen with six-digit OTP input boxes.
- Automatic OTP verification after the sixth digit is entered.
- OTP resend support with a cooldown and delivery feedback.

### Changed

- Documented local setup, Vercel deployment, environment variables, and project structure.
- Registration now routes users to the email verification screen after account creation.
- OTP verification supports paste, keyboard navigation, visible API errors, and backend error messages.
- OTP submission is guarded against duplicate requests that could consume a valid OTP and produce an `OTP not found` response.

### Fixed

- Removed the duplicate misspelled `/verity-otp` route.

## [0.1.0] - 2026-09-10

### Added

- Initial VIPHive storefront with authentication, products, cart, checkout, orders, payments, and admin routes.
