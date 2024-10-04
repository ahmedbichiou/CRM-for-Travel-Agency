import React from 'react';
import { Dialog, DialogContent, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

interface PhotoModalProps {
  open: boolean;
  onClose: () => void;
  photo: any; // Base64 string or URL
}

const PhotoModal: React.FC<PhotoModalProps> = ({ open, onClose, photo }) => {
  const imageSrc = photo.contentType === 'image/jpeg' ? photo.base64 : photo.filename;
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xl"
      fullWidth
      sx={{ zIndex: (theme) => theme.zIndex.modal + 1 }}
    >
      <IconButton
        edge="end"
        color="inherit"
        onClick={onClose}
        aria-label="close"
        sx={{
          position: 'absolute',
          right: 8,
          top: 8,
          color: (theme) => theme.palette.grey[500],
        }}
      >
        <CloseIcon />
      </IconButton>
      <DialogContent sx={{ p: 0 }}>
      <img
        src={imageSrc}
        alt="Photo"
        style={{ width: '100vw', height: '100vh', objectFit: 'contain' }}
      />
    </DialogContent>
    </Dialog>
  );
};

export default PhotoModal;