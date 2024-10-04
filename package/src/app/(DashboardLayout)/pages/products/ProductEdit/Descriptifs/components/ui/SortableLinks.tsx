import React, { FC, useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Box, Card, CardMedia, Grid, IconButton, MenuItem, Select, Typography } from '@mui/material';
import * as Icons from '@mui/icons-material';
import Link from 'next/link';

interface Description {
  _id: string;
  title: string;
  family: string;
  description: string;
  ordre: number;
}
  
interface SortableLinkCardProps {
    description: Description; // Use the Photo interface
    onDelete: (id: string) => void;
    onEdit:(productId: string, descriptionId: string) =>void ;
    product :any
  

}
const styles = {
  content: {
      overflowWrap: 'break-word', // Allows long words to break and wrap onto the next line
      wordBreak: 'break-word',    // Ensures long words will break to prevent overflow
      whiteSpace: 'pre-wrap',     // Preserves whitespace and wraps text
      width: '80%',              // Ensures the content takes up the full width of the container
  },
};

const SortableLinks: FC<SortableLinkCardProps> = ({ description, onDelete,onEdit,product  }) => {


    const { _id, title } = description;
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
        onDelete(_id);
    };
    const handleedit = () => {
      onEdit(product._id,description._id);
  };

    const isCursorGrabbing = attributes['aria-pressed'];

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
                      {description.ordre}
                    </Typography>
                  </Grid>
                  <Grid item xs={2} lg={2}>
                    <Typography variant="body2">
                      {description.title}
                    </Typography>
                  </Grid>
                  <Grid item xs={2} lg={2}>
                    <Typography variant="body2">
                      {description.family}
                    </Typography>
                  </Grid>
                  <Grid item xs={8} lg={5}>
    <Box sx={styles.content}>
        <div dangerouslySetInnerHTML={{ __html: description.description }} />
    </Box>
</Grid>
               
                  <Grid item xs={1}  lg={1}>
                 
            <IconButton 
  color="inherit" 
  size="small" 
  sx={{ color: 'green' }} // Set the color of the edit button to green
>
  <Icons.Create onClick={handleedit} fontSize="small" />
</IconButton>

<IconButton 
  color="inherit" 
  size="small" 
  sx={{ color: 'red' }} // Set the color of the delete button to red
>
  <Icons.Delete onClick={handleButtonClick} fontSize="small" />
</IconButton>
                  </Grid>
                </Grid>
              </Card>
            </div>
       
    );
};

export default SortableLinks;
