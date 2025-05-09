import React, { useState } from 'react';
import {
    Box,
    Button,
    Card,
    CardContent,
    Typography,
    CircularProgress,
    Alert,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
} from '@mui/material';
import {
    CheckCircle as CheckCircleIcon,
    Cancel as CancelIcon,
    Warning as WarningIcon,
} from '@mui/icons-material';
import verificationService from '../services/verificationService';

const RentalApplicationVerifier = ({ application, onVerificationComplete }) => {
    const [verificationStatus, setVerificationStatus] = useState(null);
    const [isVerifying, setIsVerifying] = useState(false);
    const [error, setError] = useState(null);

    const handleVerification = async () => {
        setIsVerifying(true);
        setError(null);
        try {
            const result = await verificationService.verifyRentalApplication(application);
            setVerificationStatus(result);
            onVerificationComplete(result);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsVerifying(false);
        }
    };

    const renderVerificationDetails = () => {
        if (!verificationStatus) return null;

        const { details } = verificationStatus;
        return (
            <List>
                <ListItem>
                    <ListItemIcon>
                        {details.income.proofValid ? <CheckCircleIcon color="success" /> : <CancelIcon color="error" />}
                    </ListItemIcon>
                    <ListItemText
                        primary="Income Verification"
                        secondary={`Proof Valid: ${details.income.proofValid ? 'Yes' : 'No'}`}
                    />
                </ListItem>
                <ListItem>
                    <ListItemIcon>
                        {details.income.notExpired ? <CheckCircleIcon color="success" /> : <WarningIcon color="warning" />}
                    </ListItemIcon>
                    <ListItemText
                        primary="Income Attestation Expiration"
                        secondary={`Not Expired: ${details.income.notExpired ? 'Yes' : 'No'}`}
                    />
                </ListItem>
                <ListItem>
                    <ListItemIcon>
                        {details.income.notRevoked ? <CheckCircleIcon color="success" /> : <CancelIcon color="error" />}
                    </ListItemIcon>
                    <ListItemText
                        primary="Income Attestation Revocation"
                        secondary={`Not Revoked: ${details.income.notRevoked ? 'Yes' : 'No'}`}
                    />
                </ListItem>
                <ListItem>
                    <ListItemIcon>
                        {details.credit.proofValid ? <CheckCircleIcon color="success" /> : <CancelIcon color="error" />}
                    </ListItemIcon>
                    <ListItemText
                        primary="Credit Score Verification"
                        secondary={`Proof Valid: ${details.credit.proofValid ? 'Yes' : 'No'}`}
                    />
                </ListItem>
                <ListItem>
                    <ListItemIcon>
                        {details.credit.notExpired ? <CheckCircleIcon color="success" /> : <WarningIcon color="warning" />}
                    </ListItemIcon>
                    <ListItemText
                        primary="Credit Score Attestation Expiration"
                        secondary={`Not Expired: ${details.credit.notExpired ? 'Yes' : 'No'}`}
                    />
                </ListItem>
                <ListItem>
                    <ListItemIcon>
                        {details.credit.notRevoked ? <CheckCircleIcon color="success" /> : <CancelIcon color="error" />}
                    </ListItemIcon>
                    <ListItemText
                        primary="Credit Score Attestation Revocation"
                        secondary={`Not Revoked: ${details.credit.notRevoked ? 'Yes' : 'No'}`}
                    />
                </ListItem>
            </List>
        );
    };

    return (
        <Card>
            <CardContent>
                <Typography variant="h5" gutterBottom>
                    Rental Application Verification
                </Typography>
                
                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}

                {verificationStatus && (
                    <Alert 
                        severity={verificationStatus.isValid ? "success" : "error"}
                        sx={{ mb: 2 }}
                    >
                        {verificationStatus.isValid 
                            ? "Application verified successfully!" 
                            : "Application verification failed"}
                    </Alert>
                )}

                {renderVerificationDetails()}

                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleVerification}
                        disabled={isVerifying}
                        startIcon={isVerifying ? <CircularProgress size={20} /> : null}
                    >
                        {isVerifying ? 'Verifying...' : 'Verify Application'}
                    </Button>
                </Box>
            </CardContent>
        </Card>
    );
};

export default RentalApplicationVerifier; 