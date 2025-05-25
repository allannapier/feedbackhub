import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Navbar } from './Navbar'; // Adjust path as necessary
import { usePathname } from 'next/navigation';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  usePathname: jest.fn(),
}));

// Mock Supabase client
jest.mock('@/lib/supabase/client', () => ({
  createClient: jest.fn(() => ({
    auth: {
      signOut: jest.fn().mockResolvedValue({ error: null }),
    },
  })),
}));

describe('Navbar Component', () => {
  const mockUser = {
    email: 'test@example.com',
    name: 'Test User',
  };

  beforeEach(() => {
    // Reset mocks before each test
    (usePathname as jest.Mock).mockReturnValue('/dashboard'); // Default pathname
  });

  test('renders the "Help" link when a user is provided', () => {
    render(<Navbar user={mockUser} />);
    const helpLink = screen.getByRole('link', { name: /❓ Help/i });
    expect(helpLink).toBeInTheDocument();
  });

  test('renders the "Help" link with the correct href attribute', () => {
    render(<Navbar user={mockUser} />);
    const helpLink = screen.getByRole('link', { name: /❓ Help/i });
    expect(helpLink).toHaveAttribute('href', '/dashboard/help');
  });

  test('does not render the main navigation links if user is not provided', () => {
    render(<Navbar />);
    const dashboardLink = screen.queryByRole('link', { name: /📊 Dashboard/i });
    expect(dashboardLink).not.toBeInTheDocument();
    const helpLink = screen.queryByRole('link', { name: /❓ Help/i });
    expect(helpLink).not.toBeInTheDocument();
  });

  test('renders Sign In link when user is not provided', () => {
    render(<Navbar />);
    const signInLink = screen.getByRole('link', { name: /Sign In/i });
    expect(signInLink).toBeInTheDocument();
    expect(signInLink).toHaveAttribute('href', '/auth');
  });
  
  test('highlights the "Help" link when on the help page', () => {
    (usePathname as jest.Mock).mockReturnValue('/dashboard/help');
    render(<Navbar user={mockUser} />);
    const helpLink = screen.getByRole('link', { name: /❓ Help/i });
    // Check for classes that indicate active state.
    // This depends on how isActive is implemented and the classes used.
    // Example: 'border-indigo-500 text-gray-900' for desktop
    // Example: 'bg-indigo-50 border-indigo-500 text-indigo-700' for mobile
    // We'll check for a class common to active links if possible, or a specific one.
    expect(helpLink).toHaveClass('border-indigo-500'); 
  });

   test('highlights the "Dashboard" link when on the dashboard page', () => {
    (usePathname as jest.Mock).mockReturnValue('/dashboard');
    render(<Navbar user={mockUser} />);
    const dashboardLink = screen.getByRole('link', { name: /📊 Dashboard/i });
    expect(dashboardLink).toHaveClass('border-indigo-500'); 
  });
});
