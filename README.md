# EventPortal Client

A professional React.js frontend for the Campus Event Management Portal.

## Features

- **Modern UI/UX**: Clean, professional interface with responsive design
- **Authentication**: Secure login and registration with JWT tokens
- **Event Management**: Browse, register, and manage events
- **Dashboard**: Comprehensive analytics and statistics
- **Reports**: Interactive charts and data visualization
- **Profile Management**: User profile editing and management

## Tech Stack

- **React.js 18**: Modern React with hooks
- **React Router**: Client-side routing
- **React Hook Form**: Form handling and validation
- **Axios**: HTTP client with interceptors
- **Recharts**: Data visualization and charts
- **Lucide React**: Modern icon library
- **React Hot Toast**: Toast notifications
- **Date-fns**: Date manipulation utilities

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm start
```

The application will be available at `http://localhost:3000`

### Environment Variables

Create a `.env` file in the client directory:

```env
REACT_APP_API_URL=http://localhost:5000/api
```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Layout.js       # Main layout with sidebar
│   └── ProtectedRoute.js # Route protection
├── contexts/           # React contexts
│   └── AuthContext.js  # Authentication context
├── pages/             # Page components
│   ├── Login.js       # Login page
│   ├── Register.js    # Registration page
│   ├── Dashboard.js   # Dashboard with analytics
│   ├── Events.js      # Events listing
│   ├── EventDetails.js # Event details page
│   ├── MyRegistrations.js # User registrations
│   ├── Reports.js     # Reports and analytics
│   └── Profile.js     # User profile
├── utils/             # Utility functions
│   └── api.js         # API configuration
├── App.js             # Main app component
├── index.js           # App entry point
└── index.css          # Global styles
```

## Available Scripts

- `npm start`: Start development server
- `npm build`: Build for production
- `npm test`: Run tests
- `npm eject`: Eject from Create React App

## Features Overview

### Authentication
- Secure login with email/password
- User registration with college selection
- JWT token-based authentication
- Protected routes

### Dashboard
- Key metrics and statistics
- Interactive charts and graphs
- Recent events overview
- Quick actions

### Events
- Event browsing with filters
- Event registration
- Event details with full information
- Search and filtering capabilities

### Reports
- Comprehensive analytics
- Interactive charts (Bar, Pie, Line, Area)
- Event performance metrics
- Student participation statistics

### Profile Management
- User profile editing
- Password change functionality
- Account statistics
- College information

## API Integration

The client communicates with the backend API through:

- **Base URL**: Configurable via environment variables
- **Authentication**: JWT tokens in Authorization headers
- **Error Handling**: Automatic token refresh and logout on 401 errors
- **Request/Response Interceptors**: Automatic token injection and error handling

## Styling

The application uses a custom CSS framework with:

- **Utility Classes**: Tailwind-inspired utility classes
- **Component Styles**: Custom component styling
- **Responsive Design**: Mobile-first approach
- **Modern UI**: Clean, professional appearance

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Follow the existing code style
2. Use meaningful component and variable names
3. Add proper error handling
4. Include loading states for async operations
5. Test on multiple screen sizes

## License

MIT License - see LICENSE file for details
