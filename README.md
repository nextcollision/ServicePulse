# ServicePulse - Technician Field View

Mobile-first Field Service Management (FSM) application for technicians in the field.

## Features

### Today's Route Dashboard (`/technician/dashboard`)
- Vertical scrollable feed of job cards assigned for today
- Each card shows time slot, status badge, client info, job type, and address
- Quick navigation button to open addresses in native maps app
- Pull-to-refresh functionality
- Completed jobs section

### Active Job Workflow (`/technician/job/[id]`)
State machine-based UI with four distinct states:

**State A: Dispatch/Pre-Arrival**
- Slide-to-confirm "En Route" action
- Call Client button (uses `tel:` protocol)
- Need-to-Know info (gate codes, access notes)

**State B: En Route**
- Navigation integration with native maps
- Quick call functionality
- Access reminders

**State C: In Progress (Working View)**
- Live timer counting since job start
- Tabbed interface:
  - Task List: Checkboxes for line items
  - Photos: Camera capture for before/after photos
  - Notes: Private technician notes
- Complete Job action

**State D: Job Completion**
- Time worked summary
- Materials used summary
- Signature pad for customer sign-off
- Finish & Sync action

### Additional Features
- Fixed bottom navigation (My Jobs, Map View, Inventory, Profile)
- Offline indicator with local data saving
- PWA-ready configuration

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **UI Library**: Custom shadcn/ui-style components
- **Icons**: Lucide React (large stroke widths for mobile)
- **Touch Gestures**: @use-gesture/react for swipe actions
- **Signature Capture**: react-signature-canvas
- **Styling**: Tailwind CSS v4

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) - you'll be redirected to the technician dashboard.

## Mobile UX Considerations

- Minimum 44px touch targets for accessibility
- Safe area insets for notched devices
- System font stack for optimal rendering
- Disabled user zoom for app-like experience
- Touch-friendly gestures (slide-to-confirm)
- Large icons with thick stroke widths
