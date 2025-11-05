import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { useAssignmentForm } from '../app/hooks/useAssignmentForm';
import { UpdateOrCreateConsultantAssignment } from '../components/consult-assignment-form';

// Mock the hook
jest.mock('../app/hooks/useAssignmentForm');

const mockUseAssignmentForm = useAssignmentForm as jest.Mock;

describe('UpdateOrCreateConsultantAssignment', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('shows a loading spinner while loading', () => {
    mockUseAssignmentForm.mockReturnValue({ loading: true });
    render(<UpdateOrCreateConsultantAssignment create />);

    expect(screen.getByRole('status')).toBeTruthy(); // Assuming LoadingSpinner has role="status"
  });

  it('renders "Create new assignment" text when creating', () => {
    mockUseAssignmentForm.mockReturnValue({
      loading: false,
      error: null,
      consultants: [],
      clients: [],
      partners: [],
      optionMonths: [],
      choosenMonth: null,
      dropdownErrors: {},
      consultAssignment: {},
      createAllowed: true,
      createOrUpdate: jest.fn(),
      setAssignmentValues: jest.fn(),
    });

    render(<UpdateOrCreateConsultantAssignment create />);
    expect(screen.getByText(/Create new assignment/i)).toBeTruthy();
  });

  it('disables submit button if createAllowed = false', () => {
    mockUseAssignmentForm.mockReturnValue({
      loading: false,
      error: null,
      consultants: [],
      clients: [],
      partners: [],
      optionMonths: [],
      choosenMonth: null,
      dropdownErrors: {},
      consultAssignment: {},
      createAllowed: false,
      createOrUpdate: jest.fn(),
      setAssignmentValues: jest.fn(),
    });

    render(<UpdateOrCreateConsultantAssignment create={true} />);
    const button = screen.getByRole('button', { name: /create assignment/i });
    expect(button).toBeDisabled();
  });

  it('calls createOrUpdate on form submit', () => {
    const mockSubmit = jest.fn();
    mockUseAssignmentForm.mockReturnValue({
      loading: false,
      error: null,
      consultants: [],
      clients: [],
      partners: [],
      optionMonths: [],
      choosenMonth: null,
      dropdownErrors: {},
      consultAssignment: {},
      createAllowed: true,
      createOrUpdate: mockSubmit,
      setAssignmentValues: jest.fn(),
    });

    render(<UpdateOrCreateConsultantAssignment create />);
    const form = screen.getByRole('form'); // Add role="form" to <form> in your component for better testing
    fireEvent.submit(form);
    expect(mockSubmit).toHaveBeenCalled();
  });

  it('renders error message if error exists', () => {
    mockUseAssignmentForm.mockReturnValue({
      loading: false,
      error: 'Something went wrong',
      consultants: [],
      clients: [],
      partners: [],
      optionMonths: [],
      choosenMonth: null,
      dropdownErrors: {},
      consultAssignment: {},
      createAllowed: true,
      createOrUpdate: jest.fn(),
      setAssignmentValues: jest.fn(),
    });

    render(<UpdateOrCreateConsultantAssignment create />);
    expect(screen.getByText(/something went wrong/i)).toBeTruthy();
  });
});
