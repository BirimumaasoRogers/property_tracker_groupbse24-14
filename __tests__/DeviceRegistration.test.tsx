import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import PropertyRegisterForm from '../src/components/Forms/property-register-form';
import { toast } from 'sonner'; // Import toast
import { useEffect } from 'react';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    refresh: jest.fn(),
  }),
}));

// Mock sonner toast
jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

// Mock GeofenceMap component
jest.mock('../src/components/Maps/editableGeofencemap', () => {
  // Mock implementation that calls onPolygonChange immediately with default valid data
  return ({ onPolygonChange }: { onPolygonChange: (coords: string) => void }) => {
    useEffect(() => {
      const defaultCoords = JSON.stringify([
        { lat: 0.350, lng: 32.580 },
        { lat: 0.350, lng: 32.585 },
        { lat: 0.345, lng: 32.585 },
        { lat: 0.345, lng: 32.580 }
      ]);
      onPolygonChange(defaultCoords);
    }, [onPolygonChange]);
    return <div data-testid="mock-geofence-map">Mock Geofence Map</div>;
  };
});


// Mock global fetch
const mockFetch = jest.fn();
global.fetch = mockFetch;

beforeEach(() => {
  // Reset mocks before each test
  mockFetch.mockClear();
  (toast.success as jest.Mock).mockClear();
  (toast.error as jest.Mock).mockClear();

  // Default mock response for successful property creation
  mockFetch.mockResolvedValue({
    ok: true,
    json: () => Promise.resolve({ success: true, data: { _id: 'new-property-id' } }),
  });
});


beforeAll(() => {
  // Suppress console warnings (like the ref warnings)
  jest.spyOn(console, 'warn').mockImplementation(() => {});
  jest.spyOn(console, 'error').mockImplementation((message, ...args) => {
    // Allow specific errors if needed, suppress others like the ref warning
    if (typeof message === 'string' && message.includes('Function components cannot be given refs')) {
      return;
    }
    console.error(message, ...args); // Log other errors
  });
});

afterAll(() => {
  jest.restoreAllMocks();
});

describe('Device Registration Form', () => {
  it('registers device with valid data', async () => {
    render(<PropertyRegisterForm />);

    // Open the dialog first
    fireEvent.click(screen.getByText(/Add Property/i));

    // Wait for the map mock to appear (and call onPolygonChange)
    await screen.findByTestId('mock-geofence-map');

    // Fill form fields
    fireEvent.change(screen.getByPlaceholderText('Property Name'), { target: { value: 'Test Property' } });
    fireEvent.change(screen.getByPlaceholderText('Property Description'), { target: { value: 'A test property' } });
    fireEvent.change(screen.getByPlaceholderText('Tracker ID'), { target: { value: 'TRK12345' } });
    fireEvent.change(screen.getByPlaceholderText('+1234567890'), { target: { value: '0742887933' } });

    // Submit the form
    fireEvent.click(screen.getByText(/Save property/i));

    // Wait for the fetch mock to have been called and check toast
    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith('/api/properties', expect.any(Object));
      expect(toast.success).toHaveBeenCalledWith('Property created successfully');
    });

    // Optionally check if the dialog closes (if that's the expected behavior)
    // await waitFor(() => {
    //   expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    // });
  });

  it('shows error for missing fields', async () => {
    render(<PropertyRegisterForm />);
    fireEvent.click(screen.getByText(/Add Property/i));

    // Wait for the map mock
    await screen.findByTestId('mock-geofence-map');

    fireEvent.click(screen.getByText(/Save property/i));

    // Check for validation error messages
    await waitFor(() => {
      // Expect multiple validation errors
      expect(screen.getAllByText(/should have more than 2 characters/i).length).toBeGreaterThan(0);
      expect(screen.getByText(/Input a valid Tracker ID/i)).toBeInTheDocument();
      expect(screen.getByText(/Phone number should be 10 digits or more/i)).toBeInTheDocument();
      // Note: Geofence validation might pass due to the mock providing default data
    });
     expect(toast.error).not.toHaveBeenCalled(); // Ensure no error toast on validation fail
  });

  it('shows error for invalid phone number', async () => {
    render(<PropertyRegisterForm />);
    fireEvent.click(screen.getByText(/Add Property/i));

    // Wait for the map mock
    await screen.findByTestId('mock-geofence-map');

    fireEvent.change(screen.getByPlaceholderText('Property Name'), { target: { value: 'Test Property' } });
    fireEvent.change(screen.getByPlaceholderText('Property Description'), { target: { value: 'A test property' } });
    fireEvent.change(screen.getByPlaceholderText('Tracker ID'), { target: { value: 'TRK12345' } });
    fireEvent.change(screen.getByPlaceholderText('+1234567890'), { target: { value: '123' } }); // Invalid phone

    fireEvent.click(screen.getByText(/Save property/i));

    await waitFor(() => {
      expect(screen.getByText(/Phone number should be 10 digits or more/i)).toBeInTheDocument();
    });
    expect(toast.error).not.toHaveBeenCalled();
  });

  // Add a test case for API failure
  it('shows error toast on API failure', async () => {
     // Override fetch mock for this test to simulate failure
     mockFetch.mockResolvedValueOnce({
       ok: false,
       json: () => Promise.resolve({ success: false, error: 'Internal Server Error' }),
     });

    render(<PropertyRegisterForm />);
    fireEvent.click(screen.getByText(/Add Property/i));
    await screen.findByTestId('mock-geofence-map');

    fireEvent.change(screen.getByPlaceholderText('Property Name'), { target: { value: 'Test Property' } });
    fireEvent.change(screen.getByPlaceholderText('Property Description'), { target: { value: 'A test property' } });
    fireEvent.change(screen.getByPlaceholderText('Tracker ID'), { target: { value: 'TRK12345' } });
    fireEvent.change(screen.getByPlaceholderText('+1234567890'), { target: { value: '0742887933' } });

    fireEvent.click(screen.getByText(/Save property/i));

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalled();
      expect(toast.error).toHaveBeenCalledWith('Internal Server Error'); // Or the specific error message
    });
     expect(toast.success).not.toHaveBeenCalled();
  });
});