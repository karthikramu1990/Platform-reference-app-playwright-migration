// -------------------------------------------------------------------------------------
// Date        Author     Reference    Comments
// 01-01-25    ATK                    Created reusable confirmation dialog component
// -------------------------------------------------------------------------------------

import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { IafButton } from "../iafButton/IafButton.jsx";
import styles from "./IafConfirmDialog.module.scss";

const IafConfirmDialog = (props) => {
  const {
    open,
    onClose,
    onConfirm,
    onAction,
    title,
    message,
    confirmLabel = "Confirm",
    cancelLabel = "Cancel",
    confirmVariant = "primary",
    cancelVariant = "secondary",
    actions,
    selectOptions,
    selectLabel = "Model",
    selectValue,
    onSelectChange,
  } = props;

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    }
    if (onClose) {
      onClose();
    }
  };

  const handleCancel = () => {
    if (onClose) {
      onClose();
    }
  };

  const useSelect = selectOptions && selectOptions.length > 0;
  const useCustomActions = !useSelect && actions && actions.length > 0;

  return (
    <Dialog
      open={open}
      onClose={handleCancel}
      aria-labelledby="confirm-dialog-title"
      aria-describedby="confirm-dialog-description"
      className={styles["confirm-dialog"]}
      PaperProps={{
        className: styles["confirm-dialog-paper"],
      }}
    >
      <DialogTitle id="confirm-dialog-title" className={styles["confirm-dialog-title"]}>
        {title}
      </DialogTitle>
      <DialogContent className={styles["confirm-dialog-content"]}>
        <DialogContentText
          id="confirm-dialog-description"
          className={styles["confirm-dialog-message"]}
          component="div"
        >
          {message}
        </DialogContentText>
        {useSelect ? (
          <FormControl
            fullWidth
            variant="outlined"
            size="small"
            className={styles["confirm-dialog-select"]}
          >
            <InputLabel id="confirm-dialog-select-label">{selectLabel}</InputLabel>
            <Select
              labelId="confirm-dialog-select-label"
              id="confirm-dialog-select"
              value={selectValue ?? ""}
              label={selectLabel}
              onChange={(e) => onSelectChange && onSelectChange(e.target.value)}
              MenuProps={{
                disablePortal: false,
                PaperProps: { className: styles["confirm-dialog-select-menu"] },
              }}
            >
              {selectOptions.map((opt) => (
                <MenuItem key={String(opt.id)} value={opt.id}>
                  {opt.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        ) : null}
      </DialogContent>
      <DialogActions className={styles["confirm-dialog-actions"]}>
        {useCustomActions ? (
          actions.map((action) => (
            <IafButton
              key={action.id}
              title={action.label}
              onClick={() => onAction && onAction(action.id)}
              variant={action.variant || "secondary"}
              className={`action-button action-${action.id}`}
            />
          ))
        ) : (
          <>
            <IafButton
              title={cancelLabel}
              onClick={handleCancel}
              variant={cancelVariant}
              className="cancel-button"
            />
            <IafButton
              title={confirmLabel}
              onClick={handleConfirm}
              variant={confirmVariant}
              className="confirm-button"
            />
          </>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default IafConfirmDialog;
