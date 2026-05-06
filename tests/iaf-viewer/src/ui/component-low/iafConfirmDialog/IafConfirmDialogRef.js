// -------------------------------------------------------------------------------------
// Date        Author     Reference    Comments
// 01-01-25    ATK                    Created ref-based confirmation dialog for programmatic use
// -------------------------------------------------------------------------------------

import React, { useState, forwardRef, useImperativeHandle } from 'react';
import IafConfirmDialog from './IafConfirmDialog.jsx';

/**
 * A ref-based confirmation dialog component that can be used programmatically.
 * Returns a promise that resolves to true if confirmed, false if cancelled.
 * 
 * Usage:
 *   const confirmRef = useRef();
 *   const handleAction = async () => {
 *     const confirmed = await confirmRef.current?.show({
 *       title: "Confirm Action",
 *       message: "Are you sure?",
 *       confirmLabel: "Yes",
 *       cancelLabel: "No"
 *     });
 *     if (confirmed) {
 *       // User confirmed
 *     }
 *   };
 *   return (
 *     <>
 *       <button onClick={handleAction}>Do Something</button>
 *       <IafConfirmDialogRef ref={confirmRef} />
 *     </>
 *   );
 */
export const IafConfirmDialogRef = forwardRef((props, ref) => {
    const [isOpen, setOpen] = useState(false);
    const [dialogProps, setDialogProps] = useState({
        title: 'Confirm',
        message: 'Are you sure?',
        confirmLabel: 'Confirm',
        cancelLabel: 'Cancel',
        confirmVariant: 'primary',
        cancelVariant: 'secondary',
        actions: null,
        selectOptions: null,
        selectLabel: 'Model',
    });
    const [selectedSelectId, setSelectedSelectId] = useState(null);
    const [resolvePromise, setResolvePromise] = useState(null);

    useImperativeHandle(ref, () => ({
        /**
         * Show the confirmation dialog
         * @param {Object} options - Dialog options
         * @param {string} options.title - Dialog title
         * @param {string} options.message - Dialog message
         * @param {string} options.confirmLabel - Label for confirm button (default: "Confirm")
         * @param {string} options.cancelLabel - Label for cancel button (default: "Cancel")
                 * @param {string} options.confirmVariant - Variant for confirm button (default: "primary")
         * @param {string} options.cancelVariant - Variant for cancel button (default: "secondary")
         * @param {Array<{id: string, label: string, variant?: string}>} options.actions - Optional custom actions; when provided, dialog shows one button per action and resolves with the chosen action id
         * @param {Array<{id: string, label: string}>} options.selectOptions - When provided (non-empty), shows a dropdown; confirm resolves to the selected option id (string)
         * @param {string} options.selectDefaultId - Initial selection when using selectOptions (must match an option id)
         * @param {string} options.selectLabel - Label for the select field (default "Model")
         * @returns {Promise<boolean|string>} Promise that resolves to true/false for plain confirm, chosen action id for options.actions, or selected id for options.selectOptions
         */
        show: (options = {}) => {
            return new Promise((resolve) => {
                const selectOpts =
                    options.selectOptions && options.selectOptions.length > 0
                        ? options.selectOptions
                        : null;
                let initialSelectId = null;
                if (selectOpts) {
                    const def = options.selectDefaultId;
                    initialSelectId =
                        def != null && selectOpts.some((o) => o.id === def)
                            ? def
                            : selectOpts[0].id;
                }
                setDialogProps({
                    title: options.title || 'Confirm',
                    message: options.message || 'Are you sure?',
                    confirmLabel: options.confirmLabel || 'Confirm',
                    cancelLabel: options.cancelLabel || 'Cancel',
                    confirmVariant: options.confirmVariant || 'primary',
                    cancelVariant: options.cancelVariant || 'secondary',
                    actions:
                        selectOpts
                            ? null
                            : options.actions && options.actions.length > 0
                              ? options.actions
                              : null,
                    selectOptions: selectOpts,
                    selectLabel: options.selectLabel || 'Model',
                });
                setSelectedSelectId(initialSelectId);
                setResolvePromise(() => resolve);
                setOpen(true);
            });
        },
        /**
         * Close the dialog programmatically
         */
        close: () => {
            if (resolvePromise) {
                resolvePromise(false);
                setResolvePromise(null);
            }
            setOpen(false);
        }
    }));

    const handleClose = () => {
        if (resolvePromise) {
            resolvePromise(false);
            setResolvePromise(null);
        }
        setOpen(false);
    };

    const handleConfirm = () => {
        if (resolvePromise) {
            const useSelect =
                dialogProps.selectOptions && dialogProps.selectOptions.length > 0;
            resolvePromise(useSelect ? selectedSelectId : true);
            setResolvePromise(null);
        }
        setOpen(false);
    };

    const handleAction = (actionId) => {
        if (resolvePromise) {
            resolvePromise(actionId);
            setResolvePromise(null);
        }
        setOpen(false);
    };

    return (
        <IafConfirmDialog
            open={isOpen}
            onClose={handleClose}
            onConfirm={handleConfirm}
            onAction={handleAction}
            title={dialogProps.title}
            message={dialogProps.message}
            confirmLabel={dialogProps.confirmLabel}
            cancelLabel={dialogProps.cancelLabel}
            confirmVariant={dialogProps.confirmVariant}
            cancelVariant={dialogProps.cancelVariant}
            actions={dialogProps.actions}
            selectOptions={dialogProps.selectOptions}
            selectLabel={dialogProps.selectLabel}
            selectValue={selectedSelectId}
            onSelectChange={setSelectedSelectId}
        />
    );
});

IafConfirmDialogRef.displayName = 'IafConfirmDialogRef';
