import { useEffect, useState } from 'react';

import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import { Box, FormLabel, Input, Stack, Typography } from '@mui/material';

export const AppImageUpload = ({ defaultValue, onChange }) => {
  const [selectedFile, setSelectedFile] = useState(defaultValue);
  const [preview, setPreview] = useState();

  // create a preview as a side effect, whenever selected file is changed
  useEffect(() => {
    if (!selectedFile) {
      setPreview(undefined);
      return;
    }

    const objectUrl = URL.createObjectURL(selectedFile);
    setPreview(objectUrl);
    // free memory when ever this component is unmounted
    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedFile]);

  const onSelectFile = (e) => {
    if (!e.target.files || e.target.files.length === 0) {
      setSelectedFile(undefined);
      return;
    }

    setSelectedFile(e.target.files[0]);
    if (onChange) onChange(e.target.files[0]);
  };

  return (
    <Box
      width="100%"
      height="100%"
      sx={{
        border: '1px solid',
        borderColor: 'ink.alpha20',
        borderRadius: 2,
        position: 'relative',
        overflow: 'hidden',
        padding: '3px',
        bgcolor: 'sky.lightest',
      }}>
      <FormLabel
        for="file-upload"
        sx={{
          position: 'absolute',
          zIndex: 100,
          width: '100%',
          height: '100%',
          cursor: 'pointer',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        {!selectedFile && (
          <Stack justifyItems="center" alignItems="center" display="flex">
            <AddPhotoAlternateIcon
              sx={{ color: 'primary.main', fontSize: '48px' }}
            />
            <Typography color="ink.lighter">
              Click để tải hình ảnh lên
            </Typography>
          </Stack>
        )}
      </FormLabel>
      <Input
        id="file-upload"
        type="file"
        sx={{ display: 'none' }}
        onChange={onSelectFile}
      />
      {selectedFile && (
        <Box
          sx={{
            borderRadius: 1.75,
            overflow: 'hidden',
            width: '100%',
            height: '100%',
          }}>
          <Box component="img" src={preview} width="100%" height="100%" />
        </Box>
      )}
    </Box>
  );
};
