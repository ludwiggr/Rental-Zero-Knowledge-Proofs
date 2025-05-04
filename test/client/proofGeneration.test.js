import {describe, it, expect, vi, beforeEach} from 'vitest';
import {render, screen, fireEvent, waitFor} from '@testing-library/react';
import {BrowserRouter} from 'react-router-dom';
import {AuthProvider} from '../../client/src/contexts/AuthContext';
import IncomeVerification from '../../client/src/components/proofs/IncomeVerification';
import RentalHistory from '../../client/src/components/proofs/RentalHistory';

// Mock the API calls
vi.mock('../../client/src/api/proofs', () => ({
    generateIncomeProof: vi.fn(),
    generateRentalHistoryProof: vi.fn(),
    verifyProof: vi.fn()
}));

describe('Proof Generation Components', () => {
    describe('Income Verification Component', () => {
        beforeEach(() => {
            render(
                <BrowserRouter>
                    <AuthProvider>
                        <IncomeVerification/>
                    </AuthProvider>
                </BrowserRouter>
            );
        });

        it('should render income verification form with all required fields', () => {
            expect(screen.getByLabelText(/monthly income/i)).toBeInTheDocument();
            expect(screen.getByLabelText(/income threshold/i)).toBeInTheDocument();
            expect(screen.getByRole('button', {name: /generate proof/i})).toBeInTheDocument();
        });

        it('should show validation errors for invalid income values', async () => {
            const incomeInput = screen.getByLabelText(/monthly income/i);
            const generateButton = screen.getByRole('button', {name: /generate proof/i});

            fireEvent.change(incomeInput, {target: {value: '-1000'}});
            fireEvent.click(generateButton);

            await waitFor(() => {
                expect(screen.getByText(/income must be positive/i)).toBeInTheDocument();
            });
        });

        it('should show success message when proof is generated', async () => {
            const incomeInput = screen.getByLabelText(/monthly income/i);
            const thresholdInput = screen.getByLabelText(/income threshold/i);
            const generateButton = screen.getByRole('button', {name: /generate proof/i});

            fireEvent.change(incomeInput, {target: {value: '5000'}});
            fireEvent.change(thresholdInput, {target: {value: '3000'}});
            fireEvent.click(generateButton);

            await waitFor(() => {
                expect(screen.getByText(/proof generated successfully/i)).toBeInTheDocument();
            });
        });
    });

    describe('Rental History Component', () => {
        beforeEach(() => {
            render(
                <BrowserRouter>
                    <AuthProvider>
                        <RentalHistory/>
                    </AuthProvider>
                </BrowserRouter>
            );
        });

        it('should render rental history form with all required fields', () => {
            expect(screen.getByLabelText(/on-time payments/i)).toBeInTheDocument();
            expect(screen.getByLabelText(/total payments/i)).toBeInTheDocument();
            expect(screen.getByRole('button', {name: /generate proof/i})).toBeInTheDocument();
        });

        it('should show validation errors for invalid payment values', async () => {
            const onTimeInput = screen.getByLabelText(/on-time payments/i);
            const totalInput = screen.getByLabelText(/total payments/i);
            const generateButton = screen.getByRole('button', {name: /generate proof/i});

            fireEvent.change(onTimeInput, {target: {value: '15'}});
            fireEvent.change(totalInput, {target: {value: '12'}});
            fireEvent.click(generateButton);

            await waitFor(() => {
                expect(screen.getByText(/on-time payments cannot exceed total payments/i)).toBeInTheDocument();
            });
        });

        it('should show success message when proof is generated', async () => {
            const onTimeInput = screen.getByLabelText(/on-time payments/i);
            const totalInput = screen.getByLabelText(/total payments/i);
            const generateButton = screen.getByRole('button', {name: /generate proof/i});

            fireEvent.change(onTimeInput, {target: {value: '10'}});
            fireEvent.change(totalInput, {target: {value: '12'}});
            fireEvent.click(generateButton);

            await waitFor(() => {
                expect(screen.getByText(/proof generated successfully/i)).toBeInTheDocument();
            });
        });
    });
}); 