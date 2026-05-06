// -------------------------------------------------------------------------------------
// Date        Author     Referene    Comments
// 04-03-24    RRP                    Created IafNotificationRef Component
// -------------------------------------------------------------------------------------

import React, { useState, forwardRef, useImperativeHandle } from 'react';
import IafNotification from './IafNotification.jsx';

export const IafNotificationRef = forwardRef((props, ref) => {
    const [isSnackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarDuration, setSnackbarDuration] = useState(5000);
    const [snackbarMessage, setSnackbarMessage] = useState('Hi, this is default text');
    const [severity, setSeverity] = useState('info'); // Default severity

    useImperativeHandle(ref, () => ({
        openNotification: (message, duration = 5000, severity = 'info') => {
            setSnackbarMessage(message);
            setSnackbarDuration(duration);
            setSeverity(severity);
            setSnackbarOpen(true);
        },
        closeNotification: () => {
            setSnackbarOpen(false);
        }
    }));

    return (
        <div>
            <IafNotification
                open={isSnackbarOpen}
                handleClose={() => setSnackbarOpen(false)}
                duration={snackbarDuration}
                message={snackbarMessage}
                severity={severity}
            />
        </div>
    );
});