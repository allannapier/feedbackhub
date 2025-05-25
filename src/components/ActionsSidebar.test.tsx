import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ActionsSidebar } from './ActionsSidebar'; // Adjust path as necessary

// Mock window.location.href
// We need to be able to assign to window.location.href
// One way to do this is to delete the original and replace it with a mock.
const originalLocation = window.location;
beforeAll(() => {
  delete (window as any).location;
  (window as any).location = { href: '' };
});
afterAll(() => {
  (window as any).location = originalLocation; // Restore original location
});


describe('ActionsSidebar Component', () => {
  const mockForm = {
    id: 'form-xyz-789',
    responses: [
      { id: 'resp1', rating: 5, answer: 'yes' },
      { id: 'resp2', rating: 2, answer: 'no' },
      { id: 'resp3', rating: 4, answer: 'yes' },
    ],
  };

  beforeEach(() => {
    // Reset the href for each test if needed, or ensure it's clean
    (window as any).location.href = '';
    jest.useRealTimers(); // Ensure real timers are used unless faked in a specific test
  });

  test('renders the "Export Responses" button', () => {
    render(<ActionsSidebar form={mockForm} />);
    const exportButton = screen.getByRole('button', { name: /Export Responses/i });
    expect(exportButton).toBeInTheDocument();
  });

  test('clicking "Export Responses" button navigates to the correct URL and shows loading state', async () => {
    jest.useFakeTimers(); // Use fake timers for this test

    render(<ActionsSidebar form={mockForm} />);
    
    const exportButton = screen.getByRole('button', { name: /Export Responses/i });
    expect(exportButton).not.toBeDisabled();

    fireEvent.click(exportButton);

    // Check that window.location.href was set correctly
    expect((window as any).location.href).toBe(`/api/forms/${mockForm.id}/export`);

    // Check button state changes
    expect(screen.getByRole('button', { name: /Exporting.../i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Exporting.../i })).toBeDisabled();

    // Advance timers to simulate the timeout
    jest.advanceTimersByTime(2000); // As per the component's setTimeout duration

    // Wait for the state to update and the button to re-enable
    // The button text should revert, and it should be enabled
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Export Responses/i })).toBeInTheDocument();
    });
    expect(screen.getByRole('button', { name: /Export Responses/i })).not.toBeDisabled();
    
    jest.useRealTimers(); // Restore real timers
  });

  test('renders "Generate Social Cards" button and shows count', () => {
    render(<ActionsSidebar form={mockForm} />);
    // Positive responses: rating >= 4 or answer === 'yes'
    // mockForm.responses has 2 such responses (resp1, resp3)
    const generateButton = screen.getByRole('button', { name: /Generate Social Cards \(2\)/i });
    expect(generateButton).toBeInTheDocument();
  });

  test('"Generate Social Cards" button is disabled if no positive responses', () => {
    const formWithNoPositiveResponses = {
      id: 'form-abc-123',
      responses: [
        { id: 'resp1', rating: 3, answer: 'no' },
        { id: 'resp2', rating: 2, answer: 'maybe' },
      ],
    };
    render(<ActionsSidebar form={formWithNoPositiveResponses} />);
    const generateButton = screen.getByRole('button', { name: /Generate Social Cards \(0\)/i });
    expect(generateButton).toBeDisabled();
  });
});
