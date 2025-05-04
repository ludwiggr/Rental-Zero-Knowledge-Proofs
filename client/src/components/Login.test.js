import {render, screen, fireEvent, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {BrowserRouter} from 'react-router-dom';
import Login from './Login';

// Mock the useAuth hook
jest.mock('../contexts/AuthContext', () => ({
    useAuth: () => ({
        login: jest.fn(),
        error: null,
        loading: false
    })
}));

const renderLogin = () => {
    return render(
        <BrowserRouter>
            <Login/>
        </BrowserRouter>
    );
};

describe('Login Component', () => {
    test('renders login form', () => {
        renderLogin();

        // Check for form elements
        expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
        expect(screen.getByRole('button', {name: /sign in/i})).toBeInTheDocument();
    });

    test('shows validation errors for empty fields', async () => {
        renderLogin();

        // Click sign in without entering any data
        fireEvent.click(screen.getByRole('button', {name: /sign in/i}));

        // Check for validation messages
        expect(await screen.findByText(/email is required/i)).toBeInTheDocument();
        expect(await screen.findByText(/password is required/i)).toBeInTheDocument();
    });

    test('allows user to input email and password', async () => {
        renderLogin();

        const emailInput = screen.getByLabelText(/email/i);
        const passwordInput = screen.getByLabelText(/password/i);

        // Type in the inputs
        await userEvent.type(emailInput, 'test@example.com');
        await userEvent.type(passwordInput, 'password123');

        // Check if values are set correctly
        expect(emailInput).toHaveValue('test@example.com');
        expect(passwordInput).toHaveValue('password123');
    });
}); 