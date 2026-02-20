import * as React from "react";
import Dialog from "@mui/material/Dialog";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import Button from '@mui/material/Button';

export default function DialogNew({
  Content,
  setRefresh,
  EditContentMode,
}) {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <React.Fragment>
      <Button variant="outlined" onClick={handleClickOpen}>
        New
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        {Content && 
          <Content
            Mode={EditContentMode}
            setRefresh={setRefresh}
            CloseExit={handleClose}
          />
        }
      </Dialog>
    </React.Fragment>
  );
}
