# End-to-End Testing Checklist
## AI Council Web Application

Use this checklist when performing manual end-to-end testing.

---

## Pre-Test Setup

- [ ] Clear browser cache and cookies
- [ ] Disable browser extensions (except accessibility tools for those tests)
- [ ] Ensure stable internet connection
- [ ] Have test API keys ready for all providers
- [ ] Open browser developer tools (Console, Network tabs)
- [ ] Prepare screen recording software (optional)

---

## 1. User Flow Testing

### Landing Page
- [ ] Navigate to landing page
- [ ] Verify hero section displays correctly
- [ ] Verify features section displays
- [ ] Verify "How It Works" section displays
- [ ] Test demo query interface (submit a demo query)
- [ ] Verify demo rate limiting (3 queries max)
- [ ] Click "Get Started" button

### Registration
- [ ] Verify registration form displays
- [ ] Test email validation (try invalid email)
- [ ] Test password validation (try weak password)
- [ ] Test password strength indicator
- [ ] Submit valid registration
- [ ] Verify JWT token stored in localStorage
- [ ] Verify redirect to API Key Wizard

### API Key Wizard
- [ ] Verify welcome screen displays
- [ ] Click "Next" to provider selection
- [ ] Select at least one provider (e.g., OpenAI)
- [ ] Click "Next" to API key input
- [ ] Enter valid API key
- [ ] Click "Validate" button
- [ ] Verify success message
- [ ] Click "Next" to completion
- [ ] Verify redirect to chat interface

### Chat Interface
- [ ] Verify query input is focused
- [ ] Verify execution mode selector displays
- [ ] Verify cost estimation displays
- [ ] Type query: "Explain quantum computing"
- [ ] Select execution mode (BALANCED)
- [ ] Verify character counter updates
- [ ] Click Submit button

### Real-Time Progress
- [ ] Verify WebSocket connection establishes
- [ ] Verify orchestration visualization appears
- [ ] Verify analysis stage displays
- [ ] Verify task decomposition shows subtasks
- [ ] Verify routing stage shows model assignments
- [ ] Verify execution stage shows parallel processing
- [ ] Verify progress timeline updates
- [ ] Verify synthesis stage displays
- [ ] Verify final response appears

### Response Display
- [ ] Verify response content displays
- [ ] Verify confidence score displays
- [ ] Verify execution time displays
- [ ] Verify total cost displays
- [ ] Verify orchestration breakdown displays
- [ ] Verify model contributions table displays
- [ ] Test "Copy to Clipboard" button
- [ ] Test "Download JSON" button
- [ ] Verify response saved to history

---

## 2. Responsive Design Testing

### Mobile (375px)
- [ ] Resize browser to 375px width
- [ ] Test landing page layout
- [ ] Test registration form layout
- [ ] Test API Key Wizard layout
- [ ] Test chat interface layout
- [ ] Test response display layout
- [ ] Test history page layout
- [ ] Test dashboard layout
- [ ] Verify no horizontal scroll
- [ ] Verify touch targets are adequate (44px min)

### Tablet (768px)
- [ ] Resize browser to 768px width
- [ ] Test landing page layout
- [ ] Test registration form layout
- [ ] Test API Key Wizard layout
- [ ] Test chat interface layout
- [ ] Test response display layout
- [ ] Test history page layout
- [ ] Test dashboard layout

### Desktop (1920px)
- [ ] Resize browser to 1920px width
- [ ] Test landing page layout
- [ ] Test registration form layout
- [ ] Test API Key Wizard layout
- [ ] Test chat interface layout
- [ ] Test response display layout
- [ ] Test history page layout
- [ ] Test dashboard layout
- [ ] Verify content is centered with max-width

---

## 3. Cross-Browser Testing

### Chrome
- [ ] Open application in Chrome
- [ ] Complete full user flow
- [ ] Check console for errors
- [ ] Check network tab for failed requests
- [ ] Verify animations are smooth
- [ ] Run Lighthouse audit

### Firefox
- [ ] Open application in Firefox
- [ ] Complete full user flow
- [ ] Check console for errors
- [ ] Check network tab for failed requests
- [ ] Verify animations are smooth
- [ ] Note any visual differences

### Safari
- [ ] Open application in Safari
- [ ] Complete full user flow
- [ ] Check console for errors
- [ ] Check network tab for failed requests
- [ ] Verify animations are smooth
- [ ] Note any visual differences

### Edge
- [ ] Open application in Edge
- [ ] Complete full user flow
- [ ] Check console for errors
- [ ] Check network tab for failed requests
- [ ] Verify animations are smooth

---

## 4. Keyboard Navigation Testing

### Landing Page
- [ ] Tab through all interactive elements
- [ ] Verify focus indicators are visible
- [ ] Press Enter on CTA buttons
- [ ] Press Escape to close modals

### Registration/Login
- [ ] Tab through form fields
- [ ] Press Enter to submit form
- [ ] Verify focus moves to error fields

### API Key Wizard
- [ ] Tab through provider cards
- [ ] Use arrow keys to navigate
- [ ] Press Space to select provider
- [ ] Press Enter to advance steps
- [ ] Press Escape to close wizard

### Chat Interface
- [ ] Tab to query input
- [ ] Tab to execution mode selector
- [ ] Use arrow keys to change mode
- [ ] Press Ctrl+Enter to submit
- [ ] Tab through orchestration visualization
- [ ] Press Enter to expand/collapse sections

### History Page
- [ ] Tab through search and filters
- [ ] Tab through request cards
- [ ] Use arrow keys for pagination
- [ ] Press Enter to open details

### Dashboard
- [ ] Tab through stat cards
- [ ] Tab through charts
- [ ] Tab through tables

### Settings Page
- [ ] Tab through all form fields
- [ ] Press Space to toggle checkboxes
- [ ] Press Enter to save

### Keyboard Shortcuts
- [ ] Test Ctrl+K (focus search)
- [ ] Test Escape (close modals)
- [ ] Test Ctrl+Enter (submit query)
- [ ] Test Ctrl+/ (toggle help)
- [ ] Test Ctrl+H (toggle history)

---

## 5. Screen Reader Testing

### NVDA (Windows)
- [ ] Start NVDA
- [ ] Navigate to landing page
- [ ] Verify page title is announced
- [ ] Navigate by headings (H key)
- [ ] Navigate by landmarks (D key)
- [ ] Navigate by links (K key)
- [ ] Navigate by form fields (F key)
- [ ] Test registration form
- [ ] Test API Key Wizard
- [ ] Test chat interface
- [ ] Verify dynamic updates are announced
- [ ] Verify error messages are announced

### VoiceOver (macOS)
- [ ] Start VoiceOver (Cmd+F5)
- [ ] Navigate to landing page
- [ ] Open rotor (Ctrl+Option+U)
- [ ] Navigate by headings
- [ ] Navigate by landmarks
- [ ] Navigate by links
- [ ] Navigate by form controls
- [ ] Test registration form
- [ ] Test API Key Wizard
- [ ] Test chat interface
- [ ] Verify dynamic updates are announced

### Accessibility Audit
- [ ] Run Lighthouse accessibility audit
- [ ] Verify score is 90+
- [ ] Check for WCAG violations
- [ ] Verify color contrast ratios
- [ ] Verify alt text on images
- [ ] Verify form labels
- [ ] Verify ARIA attributes

---

## 6. Error Scenario Testing

### Invalid API Key
- [ ] Enter invalid API key in wizard
- [ ] Click "Validate"
- [ ] Verify error message displays
- [ ] Verify input shows error state
- [ ] Verify user can retry

### Network Error
- [ ] Disconnect network (or use DevTools offline mode)
- [ ] Attempt to submit query
- [ ] Verify error message displays
- [ ] Verify retry button appears
- [ ] Reconnect network
- [ ] Click retry
- [ ] Verify query submits successfully

### WebSocket Connection Failure
- [ ] Submit query
- [ ] Disconnect network during processing
- [ ] Verify "Connection lost" message
- [ ] Reconnect network
- [ ] Verify automatic reconnection
- [ ] Verify progress updates resume

### Rate Limit Exceeded
- [ ] Submit 100 queries rapidly (use script if needed)
- [ ] Attempt 101st query
- [ ] Verify 429 error message
- [ ] Verify retry-after time displays
- [ ] Verify submit button is disabled

### Authentication Token Expiration
- [ ] Log in
- [ ] Manually expire token (modify localStorage)
- [ ] Attempt to submit query
- [ ] Verify redirect to login page
- [ ] Verify "Session expired" message
- [ ] Log in again
- [ ] Verify redirect back to chat

### Provider API Failure
- [ ] Configure only one provider
- [ ] Simulate provider failure (if possible)
- [ ] Submit query
- [ ] Verify fallback behavior
- [ ] Verify error message if all providers fail

### Invalid Query Input
- [ ] Attempt to submit empty query
- [ ] Verify submit button is disabled
- [ ] Enter query > 5000 characters
- [ ] Verify error message displays
- [ ] Enter only whitespace
- [ ] Verify validation error

### Database Connection Failure
- [ ] Simulate database unavailability (if possible)
- [ ] Attempt to submit query
- [ ] Verify error message displays
- [ ] Verify user can retry

### Malformed API Response
- [ ] Simulate malformed response (if possible)
- [ ] Verify error is handled gracefully
- [ ] Verify fallback provider is attempted
- [ ] Verify error message displays

### Concurrent Request Limit
- [ ] Open 6 browser tabs
- [ ] Submit query in each tab
- [ ] Verify 6th request shows error
- [ ] Verify connection limit enforced

---

## 7. Performance Testing

### Page Load Performance
- [ ] Open DevTools Performance tab
- [ ] Navigate to landing page
- [ ] Record page load
- [ ] Verify First Contentful Paint < 1s
- [ ] Verify Largest Contentful Paint < 2s
- [ ] Verify Time to Interactive < 3s
- [ ] Run Lighthouse performance audit
- [ ] Verify score is 90+

### WebSocket Performance
- [ ] Submit query
- [ ] Monitor WebSocket messages in Network tab
- [ ] Verify connection time < 200ms
- [ ] Verify message latency < 50ms
- [ ] Verify heartbeat interval is 30s

---

## 8. Security Testing

### Authentication Security
- [ ] Verify passwords are not visible in network requests
- [ ] Verify JWT tokens are signed
- [ ] Verify HTTPS is enforced
- [ ] Verify CORS headers are set
- [ ] Verify XSS protection headers
- [ ] Verify CSRF protection

### Input Validation
- [ ] Attempt SQL injection in form fields
- [ ] Attempt XSS in form fields
- [ ] Verify all inputs are sanitized
- [ ] Verify API key format validation
- [ ] Verify email format validation
- [ ] Verify password strength validation

---

## 9. Additional Testing

### Theme Switching
- [ ] Toggle between light and dark themes
- [ ] Verify all pages render correctly in both themes
- [ ] Verify theme preference is saved
- [ ] Verify theme persists across page reloads

### History and Dashboard
- [ ] Navigate to history page
- [ ] Test search functionality
- [ ] Test filter by execution mode
- [ ] Test filter by date range
- [ ] Test pagination
- [ ] Navigate to dashboard
- [ ] Verify statistics display correctly
- [ ] Verify charts render correctly

### Admin Interface (if admin user)
- [ ] Navigate to admin page
- [ ] Verify user management table displays
- [ ] Test user search
- [ ] Test user status toggle
- [ ] Test role promotion
- [ ] Verify monitoring dashboard displays
- [ ] Verify provider health status displays

### Settings Page
- [ ] Navigate to settings page
- [ ] Update profile information
- [ ] Add/edit API keys
- [ ] Change password
- [ ] Toggle theme
- [ ] Save changes
- [ ] Verify changes persist

---

## Post-Test Actions

- [ ] Document all issues found
- [ ] Categorize issues by severity (Critical, High, Medium, Low)
- [ ] Take screenshots of issues
- [ ] Record console errors
- [ ] Create bug reports for critical issues
- [ ] Update TESTING_REPORT.md with findings
- [ ] Share results with development team

---

## Test Sign-Off

**Tester Name:** ___________________________  
**Test Date:** ___________________________  
**Browser/Device:** ___________________________  
**Overall Result:** ☐ PASS  ☐ FAIL  ☐ PASS WITH ISSUES  

**Notes:**
_____________________________________________________________
_____________________________________________________________
_____________________________________________________________

