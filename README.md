
# Merkl.dev Web Development Platform

## Project Overview

**Merkl.dev** is a comprehensive web development agency platform that provides clients with seamless project management, feature selection, and payment processing capabilities. Built with modern web technologies for optimal performance and user experience.

## Features

- **Client Dashboard**: Track project progress and manage orders
- **Admin Management**: Complete administrative control over projects, users, and payments
- **Dynamic Feature Selection**: Flexible pricing and feature customization system
- **Multi-Bank Payment Integration**: Secure payment processing with multiple Ethiopian banks
- **Project Tracking**: Real-time project status updates and progress monitoring
- **User Authentication**: Secure role-based access control system
- **Newsletter Management**: Subscription and communication features

## Technology Stack

This platform is built with cutting-edge technologies:

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **Styling**: Tailwind CSS with shadcn/ui component library
- **Backend**: Supabase (PostgreSQL + Authentication + Real-time)
- **State Management**: React Query (@tanstack/react-query)
- **Routing**: React Router DOM
- **Icons**: Lucide React
- **Charts**: Recharts for data visualization

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn package manager

### Installation

1. Clone the repository:
```sh
git clone <YOUR_GIT_URL>
cd <YOUR_PROJECT_NAME>
```

2. Install dependencies:
```sh
npm install
```

3. Set up environment variables:
```sh
# Create a .env file and add your Supabase credentials
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Start the development server:
```sh
npm run dev
```

The application will be available at `http://localhost:8080`

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   └── admin/          # Admin-specific components
├── pages/              # Page components
├── contexts/           # React contexts (Auth, etc.)
├── hooks/              # Custom React hooks
├── integrations/       # External service integrations
├── lib/                # Utility functions
└── types/              # TypeScript type definitions
```

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Code Style

This project follows strict TypeScript and ESLint configurations. Make sure to:
- Use TypeScript for all new files
- Follow the established component patterns
- Use Tailwind CSS for styling
- Implement proper error handling

## Database Schema

The platform uses Supabase with the following main tables:
- `users` - User authentication and profiles
- `projects` - Project management
- `features` - Available features and pricing
- `project_features` - Project-feature relationships
- `payments` - Payment tracking
- `contact_messages` - Client communications

## Deployment

### Production Build

1. Build the project:
```sh
npm run build
```

2. Deploy the `dist` folder to your hosting provider

### Environment Variables

Ensure the following environment variables are set in production:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## Support

For support and inquiries, please contact the Merkl.dev team.

## License

This project is proprietary software owned by Merkl.dev.
