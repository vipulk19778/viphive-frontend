## [Unreleased]

- Added descriptive metadata, canonical URL, crawler directives, and Open Graph tags for homepage SEO.
- Added a homepage loading skeleton that mirrors the loaded layout to avoid layout shift.

### Changed

- Refined homepage recommendations, desktop featured-product layout, catalog hierarchy, and instant theme switching.
- Optimized Pexels product image URLs with compression and display-sized delivery parameters across product views.
- Restored the Swiper product carousel while retaining image loading/layout hints for faster first paint.
- Added infinite product scrolling with 12-product pages loaded as the user reaches the catalog end.
- Reduced the initial product request and enabled lazy image decoding for catalog cards.
- Added eye-icon password visibility toggles to authentication password fields.
- Segregated product detail, checkout, orders, and payments page implementations into feature-owned pages, leaving route files responsible for routing and guards.
- Split product catalog and featured-product cards into reusable product components.
