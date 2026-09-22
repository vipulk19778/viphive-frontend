## [Unreleased]

- Added descriptive metadata, canonical URL, crawler directives, and Open Graph tags for homepage SEO.
- Added a homepage loading skeleton that mirrors the loaded layout to avoid layout shift.
- Fixed Featured sorting to rank products instead of preserving search/API order.
- Added server-side search pagination so searches can load beyond the first page only when matching results remain.
- Debounced product search input updates to reduce API requests while typing.
- Moved product sorting before pagination so all loaded pages follow one global order.
- Added button-based pagination and search controls to admin Products, Orders, Payments, and Users sections.
- Added responsive admin row limits, icon-only pagination buttons, and wrapper-level search focus styling.
- Replaced the native product delete alert with a shared confirmation modal.
- Added a 10px backdrop blur when the confirmation modal opens.
- Improved admin mobile pagination, debounced admin searches, and sortable table headers.
- Consolidated admin search into the shared header search field.
- Added field-specific admin search placeholders and order-ID search support.
- Restricted protected routes to verified users and simplified admin Payments search/table fields.
- Added clear empty and no-match states to admin data tables.
- Replaced the category filter scrollbar with a touch-friendly Swiper strip.
- Added complete product categories to the products API metadata for filtering.
- Moved category filtering into the paginated products API to prevent unrelated page loads.

### Changed

- Refined homepage recommendations, desktop featured-product layout, catalog hierarchy, and instant theme switching.
- Optimized Pexels product image URLs with compression and display-sized delivery parameters across product views.
- Restored the Swiper product carousel while retaining image loading/layout hints for faster first paint.
- Added infinite product scrolling with 12-product pages loaded as the user reaches the catalog end.
- Reduced the initial product request and enabled lazy image decoding for catalog cards.
- Added eye-icon password visibility toggles to authentication password fields.
- Segregated product detail, checkout, orders, and payments page implementations into feature-owned pages, leaving route files responsible for routing and guards.
- Split product catalog and featured-product cards into reusable product components.
