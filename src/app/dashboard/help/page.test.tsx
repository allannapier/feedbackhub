import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import HelpPage from './page'; // Adjust path as necessary
import Link from 'next/link';

// Mock Next.js Link component for testing environments
jest.mock('next/link', () => {
  return ({ children, href }: { children: React.ReactNode, href: string }) => {
    return <a href={href}>{children}</a>;
  };
});

describe('HelpPage Component', () => {
  beforeEach(() => {
    render(<HelpPage />);
  });

  test('renders the main "Help Center" heading', () => {
    const mainHeading = screen.getByRole('heading', { name: /Help Center/i, level: 1 });
    expect(mainHeading).toBeInTheDocument();
  });

  test('renders the "Getting Started" section heading', () => {
    const sectionHeading = screen.getByRole('heading', { name: /Getting Started/i, level: 2 });
    expect(sectionHeading).toBeInTheDocument();
  });

  test('renders the "Managing Feedback Forms" section heading', () => {
    const sectionHeading = screen.getByRole('heading', { name: /Managing Feedback Forms/i, level: 2 });
    expect(sectionHeading).toBeInTheDocument();
  });

  test('renders the "Viewing and Analyzing Responses" section heading', () => {
    const sectionHeading = screen.getByRole('heading', { name: /Viewing and Analyzing Responses/i, level: 2 });
    expect(sectionHeading).toBeInTheDocument();
  });

  test('renders the "Social Sharing & Testimonials" section heading', () => {
    const sectionHeading = screen.getByRole('heading', { name: /Social Sharing & Testimonials/i, level: 2 });
    expect(sectionHeading).toBeInTheDocument();
  });

  test('renders the "Embedding Widgets" section heading', () => {
    const sectionHeading = screen.getByRole('heading', { name: /Embedding Widgets/i, level: 2 });
    expect(sectionHeading).toBeInTheDocument();
  });

  test('renders the "Account & Billing" section heading', () => {
    const sectionHeading = screen.getByRole('heading', { name: /Account & Billing/i, level: 2 });
    expect(sectionHeading).toBeInTheDocument();
  });
});
