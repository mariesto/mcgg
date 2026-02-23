## 1. DashboardView Header Updates

- [x] 1.1 Replace `.logout-action` with `.nav-link` class on logout button in DashboardView.vue
- [x] 1.2 Add `isDarkMode` ref and `toggleTheme()` function to DashboardView.vue script
- [x] 1.3 Add theme toggle button to DashboardView.vue header with sun/moon SVG icons
- [x] 1.4 Add theme initialization logic in onMounted to read from localStorage
- [x] 1.5 Copy `.theme-toggle` CSS styles from PublicView.vue to DashboardView.vue (if not global)

## 2. TicketListView Header Updates

- [x] 2.1 Replace `.btn.btn-primary` with `.nav-link` class on "Submit New Game" button
- [x] 2.2 Add plus icon SVG to "Submit New Game" button

## 3. Cleanup

- [x] 3.1 Remove unused `.logout-action` CSS from DashboardView.vue
- [x] 3.2 Remove unused `.btn.btn-primary` overrides from TicketListView.vue header (if any)
- [ ] 3.3 Test theme toggle persistence across all views (PublicView, AdminView, DashboardView)
- [ ] 3.4 Test header CTA hover states and visual consistency
