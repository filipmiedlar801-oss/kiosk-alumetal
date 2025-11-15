# Alumetal Kiosk - Driver Registration Application

A web application for a multimedia kiosk for self-service driver registration at a Alumetal facility.

## 🚀 Quick Start

### Requirements
- Node.js 20.x or newer
- npm 10.x or newer

### Installation and Setup

```bash
# 1. Install dependencies
npm install

# 2. API Configuration 
# Create a .env.local file in the root directory and add your API key:
# VITE_API_BASE_URL=https://tstalumetal.soot.pl/rapi
# VITE_API_KEY=your_api_key_here

# 3. Run the application in development mode
npm run dev

# 4. Open in browser
# http://localhost:5173
```


### Production Build

```bash
# Build the application
npm run build

# Preview the build
npm run preview
```

## 📱 Features


1. **Language Selection Screen** (`/language`)
   - Choice between PL/EN

2. **Notification List Screen** (`/notifications`)
   - Display added notifications
   - Add new notifications via search
   - Remove notifications from the list
   - Validation (minimum 1 notification required)
   - Persistent storage using localStorage

3. **Search Notification Screen** (`/search`) 
   - 3 search methods: PIN, Order ID, QR Code
   - Tabs for switching between methods
   - Error handling and empty results
   - QR code scanner integration

4. **Notification Details Screen** (`/notification/:id`)
   - Display driver, vehicle, and cargo data
   - 3 variants: foreign delivery (SENT), domestic (BDO), shipment
   - Data consistency checkbox
   - Input fields for codes (SENT/BDO/waste codes)
   - Compact table layout

5. **Registration Summary Screen** (`/summary`)
   - Registration completion confirmation
   - List of registered notifications
   - Information about next steps

6. **Error Screen-!!TODO!!** () (`/error`)
   - Display detected errors/inconsistencies
   - 3 action options: return, email to logistics, finish
   - Email sending dialog

### 🔧 Technologies

- **React 19** + **TypeScript**
- **Vite** - build tool
- **Material-UI (MUI)** - UI components
- **React Router** - routing
- **React Query (@tanstack/react-query)** - API state management
- **Axios** - HTTP client
- **i18next** - internationalization (PL/EN)
- **html5-qrcode-!!TODO!!** - QR code scanning
- **date-fns** - date formatting

## 🔌 API Configuration


### Add API Key

Create a `.env.local` file in the project root directory:

```bash
VITE_API_BASE_URL=https://tstalumetal.soot.pl/rapi
VITE_API_KEY=your_api_key_here  # <- Add your key here
```

### API Documentation

- Swagger UI: https://tstalumetal.soot.pl/rapi/swagger/index.html
- Implemented endpoints:
  - `GET /km/nfind/{mode}/{code}` - Find notification by PIN, Order ID, or QR code
  - `GET /km/notifs/{id}` - Get notification(s) by ID(s)
  - `GET /km/inconsistencies/{notificationId}` - Get inconsistencies for a notification
  - `POST /km/verify` - Verify notification data (TODO)

### API Integration

The application uses:
- Axios client with request/response interceptors
- React Query hooks for data fetching and caching
- TypeScript types matching API responses
- Automatic retry logic and error handling

## 🎨 Project Structure

```
src/
├── api/                    # API Integration 
│   ├── client.ts           # Axios client with interceptors
│   ├── types.ts            # TypeScript types from API
│   ├── endpoints.ts        # API call functions
│   └── hooks.ts            # React Query hooks
├── components/             # Shared components
│   ├── Layout/
│   ├── LanguageSelector/
│   ├── NotificationCard/
│   ├── QRScanner/
│   └── LoadingSpinner/
├── pages/                  # Application screens
│   ├── LanguageScreen/
│   ├── NotificationListScreen/
│   ├── SearchNotificationScreen/
│   ├── NotificationDetailsScreen/
│   ├── SummaryScreen/
│   └── ErrorScreen/
├── context/                # Context providers
│   └── NotificationContext.tsx
├── i18n/                   # Translations
│   ├── config.ts
│   ├── pl.json
│   └── en.json
├── theme/                  # MUI theme
│   └── theme.ts
└── App.tsx                 # Root component
```

## 🌐 Routes

- `/` - Redirects to `/language`
- `/language` - Language selection screen
- `/notifications` - Notification list screen
- `/search` - Search notification screen
- `/notification/:id` - Notification details screen
- `/summary` - Registration summary screen
- `/error` - Error/inconsistency handling screen

## 🎨 Alumetal Branding

- **Primary brand color**: `#f29400` (orange)
- **Secondary color**: `#424242` (dark gray)
- **Background**: `#F8F9FA`


## 👨‍💻 Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Linting
npm run lint

# Build for production
npm run build

# Preview production build
npm run preview
```

---
