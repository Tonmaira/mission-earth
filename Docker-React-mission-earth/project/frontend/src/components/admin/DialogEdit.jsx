import * as React from "react";
import Dialog from "@mui/material/Dialog";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";

export default function DialogEdit({
  Id,
  Content,
  setRefresh,
  EditContentMode,
  OriginalContent,
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
      <IconButton aria-label="delete" onClick={handleClickOpen}>
        <EditIcon />
      </IconButton>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        {Content ? (
          <Content
            Mode={EditContentMode}
            setRefresh={setRefresh}
            EditId={Id}
            OriginalContent={OriginalContent}
            CloseExit={handleClose}
          />
        ) : (
          "Null"
        )}
      </Dialog>
    </React.Fragment>
  );
}
