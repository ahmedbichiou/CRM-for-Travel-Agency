import React, { FC, useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card, CardMedia, Grid, IconButton, MenuItem, Select, Typography } from '@mui/material';
import * as Icons from '@mui/icons-material';
import PhotoModal from './ui/modal';
interface Photo {
    contentType: string; // Changed from 'any' to 'string' for more accurate typing
    _id: string;
    filename: string;
    ordre: number;
    base64: string;
    photoType:string; // Use the enum for photoType
  }
  
interface SortableLinkCardProps {
    photo: Photo; // Use the Photo interface
    onDelete: (id: string,contentType: string) => void;
    ontypechange: (id: string,newvalue : string,contentType : string ) => void;

}

const SortableLinks: FC<SortableLinkCardProps> = ({ photo, onDelete,ontypechange }) => {
  const isImage = photo.contentType === 'image/jpeg';
  const imageUrl = isImage ? photo.base64 : photo.filename;
    const handleOpen = () => setModalOpen(true);
    const handleClose = () => setModalOpen(false);
    const { _id, filename } = photo;
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({ id: _id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    const handleButtonClick = () => {
        onDelete(_id,photo.contentType);
    };
    const displayText = photo.contentType === 'url' ? '  ' : photo.filename;
    const isCursorGrabbing = attributes['aria-pressed'];
    const [modalOpen, setModalOpen] = useState(false);
        return (
            <div ref={setNodeRef} style={style} key={_id}>
              <Card sx={{ padding: 2, boxShadow: 2 ,margin:2}}>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={1} lg={1}>
                  <button
  {...attributes}
  {...listeners}
  style={{
    background: 'none',
    border: 'none',
    padding: 0,
    cursor: isCursorGrabbing ? 'grabbing' : 'grab',
  }}
  aria-describedby={`DndContext-${_id}`}
>
  <Icons.ReorderSharp />
</button>

                  </Grid>
                  <Grid item xs={2} lg={1}>
                    <Typography variant="body2">
                      {photo.ordre}
                    </Typography>
                  </Grid>
                  <Grid item xs={2} lg={2}>
                    <Typography variant="body2">
                    {displayText}
                    </Typography>
                  </Grid>
                  <Grid item xs={8} lg={5}>
                  <Card sx={{ width: '40vh', height: '20vh' }}>
                  <Card sx={{ width: '40vh', height: '20vh' }}>
            <CardMedia
                component="img"
                image={imageUrl}
                alt={photo.filename}
                sx={{ width: '100%', height: '100%', objectFit: 'cover', cursor: 'pointer' }}
                onClick={handleOpen}
            />
        </Card>
      <PhotoModal open={modalOpen} onClose={handleClose} photo={photo} />
            </Card> </Grid>
                  <Grid item xs={2} lg={2}>
                    <Select
                      value={photo.photoType || 'List'} // Default to 'List' if no view type is selected
                      onChange={(e) => ontypechange(photo._id, e.target.value,photo.contentType)}
                      displayEmpty
                      size="small"
                      fullWidth
                    >
                      <MenuItem value="List">List</MenuItem>
                      <MenuItem value="Gallery">Gallery</MenuItem>
                      <MenuItem value="Panoramic">Panoramic</MenuItem>
                      <MenuItem value="Icon">Icon</MenuItem>
                    </Select>
                  </Grid>
                  <Grid item xs={1}  lg={1}>
                  <IconButton color="inherit" size="small">
              <Icons.Delete onClick={handleButtonClick} fontSize="small" />
            </IconButton>
                
                  </Grid>
                </Grid>
              </Card>
            </div>
       
    );
};

export default SortableLinks;
