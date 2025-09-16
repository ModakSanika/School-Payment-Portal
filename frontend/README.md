# School Payment Dashboard - Frontend

A modern, responsive React-based dashboard for managing school payments and transactions.

![React](https://img.shields.io/badge/React-18.2.0-blue.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0.2-blue.svg)
![Vite](https://img.shields.io/badge/Vite-4.4.5-purple.svg)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.3.0-teal.svg)

## Features

### 🔐 Authentication
- **Secure Login**: JWT-based authentication with form validation
- **Theme Support**: Light/Dark mode toggle with system preference detection
- **Demo Credentials**: Pre-filled demo login for testing
- **Responsive Design**: University-themed background with glassmorphism effects

### 📊 Dashboard
- **Overview Analytics**: Real-time statistics and key metrics
- **Quick Actions**: Fast access to common operations
- **Recent Transactions**: Latest payment activities with status indicators
- **Interactive Charts**: Visual representation of payment data

### 💳 Transaction Management
- **Advanced Table**: Sortable columns with hover effects
- **Search & Filters**: Multi-parameter filtering system
- **Pagination**: Efficient data loading with customizable page sizes
- **Export Functionality**: Download transaction data
- **Real-time Status**: Live payment status updates

### 🏫 School-Specific Views
- **School Details**: Comprehensive school information
- **Student Management**: Individual student transaction history
- **Fee Breakdown**: Detailed payment analysis
- **Performance Metrics**: School-specific analytics

### ❓ Transaction Status Check
- **Real-time Tracking**: Check payment status by ID
- **Transaction Timeline**: Step-by-step payment progress
- **Multiple ID Support**: Search by Transaction, Order, or Collect ID
- **Recent Searches**: Quick access to previously searched transactions

### 💰 Payment Creation
- **Step-by-step Process**: Guided payment request creation
- **Form Validation**: Comprehensive input validation
- **Live Preview**: Real-time payment preview
- **Gateway Integration**: Secure payment processing

### 🎨 UI/UX Features
- **Glassmorphism Design**: Modern transparent card effects
- **Smooth Animations**: CSS transitions and micro-interactions
- **Table Hover Effects**: Advanced row highlighting with gradients
- **Responsive Layout**: Mobile-first design approach
- **Dark Mode**: Complete theme switching capability

## Tech Stack

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router v6
- **Icons**: Lucide React
- **State Management**: React Context API
- **HTTP Client**: Axios (configured for future backend integration)

## Installation & Setup

### Prerequisites
- Node.js 16+ and npm/yarn
- Modern web browser

### 1. Clone & Install
```bash
git clone <repository-url>
cd school-payment-app/frontend
npm install
```

### 2. Environment Setup
Create `.env.local`:
```bash
VITE_API_BASE_URL=http://localhost:3000/api
VITE_APP_NAME=School Payment Dashboard
VITE_APP_VERSION=1.0.0
NODE_ENV=development
```

### 3. Add Background Image
Add your university background image to:
```
public/images/university-background.jpg
```
Recommended size: 1920x1080px or higher

### 4. Start Development Server
```bash
npm run dev
```

Visit `http://localhost:5173`

## Demo Credentials

For testing purposes, use these demo credentials:
- **Email**: `demo@school.com`
- **Password**: `demo123`

## Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── auth/            # Authentication components
│   ├── common/          # Shared components
│   ├── dashboard/       # Dashboard-specific components
│   ├── layout/          # Layout components
│   └── payments/        # Payment-related components
├── context/             # React Context providers
├── App.tsx             # Main app component
├── main.tsx            # Entry point
└── index.css           # Global styles
```

## Key Components

### Authentication (`src/components/auth/`)
- **LoginForm**: University-themed login with validation

### Dashboard (`src/components/dashboard/`)
- **Dashboard**: Main overview with stats and recent transactions
- **TransactionOverview**: Advanced table with filtering and search
- **TransactionDetails**: School-specific transaction views
- **TransactionStatus**: Real-time transaction status checker

### Layout (`src/components/layout/`)
- **Layout**: Main layout wrapper with animated background
- **Header**: Navigation header with search and user controls
- **Sidebar**: Animated sidebar navigation

### Payments (`src/components/payments/`)
- **CreatePayment**: Multi-step payment creation form

## Features in Detail

### Advanced Table Features
- **Sortable Columns**: Click headers to sort data
- **Multi-parameter Filtering**: Filter by status, gateway, payment mode, date range
- **Search**: Full-text search across transaction fields  
- **Selection**: Bulk select with actions
- **Hover Effects**: Gradient hover effects with animated borders
- **Responsive**: Mobile-optimized table layout

### Theme System
- **Auto Detection**: Respects system dark/light preference
- **Manual Toggle**: Theme switcher in header
- **Persistent**: Saves preference in localStorage
- **Complete Coverage**: All components support both themes

### Background Effects
- **Animated Elements**: Floating particles and shapes
- **Glassmorphism**: Transparent cards with backdrop blur
- **Gradient Mesh**: Dynamic background gradients
- **Grid Pattern**: Subtle grid overlay
- **Light Rays**: Animated light effects

## API Integration

The frontend is prepared for backend integration with:
- **Axios Configuration**: Pre-configured HTTP client
- **Error Handling**: Comprehensive error management
- **Loading States**: Loading indicators throughout
- **Mock Data**: Realistic demo data for testing

To connect to your backend:
1. Update `VITE_API_BASE_URL` in `.env.local`
2. Replace mock data calls in components with actual API calls
3. Update authentication logic in `AuthContext`

## Build & Deployment

### Development Build
```bash
npm run build
npm run preview
```

### Production Deployment

#### Netlify/Vercel
1. Connect your repository
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Add environment variables

#### Custom Server
```bash
npm run build
# Deploy /dist folder to your web server
```

## Performance Optimizations

- **Code Splitting**: React.lazy for route-based splitting
- **Image Optimization**: Optimized background images
- **Bundle Analysis**: Built-in bundle analyzer
- **CSS Purging**: Tailwind CSS purges unused styles
- **Gzip Compression**: Enabled in build process

## Browser Support

- Chrome 88+
- Firefox 85+
- Safari 14+
- Edge 88+

## Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -am 'Add new feature'`
4. Push to branch: `git push origin feature/new-feature`
5. Submit pull request

## License

This project is licensed under the MIT License.

## Support

For support or questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

## Roadmap

- [ ] Real-time notifications
- [ ] Advanced analytics dashboard
- [ ] Multi-language support
- [ ] PWA capabilities
- [ ] Mobile app integration
- [ ] Advanced reporting features