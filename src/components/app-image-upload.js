import { useEffect, useState } from 'react';

import { Delete } from '@mui/icons-material';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import {
  Box,
  Button,
  FormLabel,
  Input,
  Stack,
  SvgIcon,
  Typography,
} from '@mui/material';

export const AppImageUpload = (props) => {
  const { defaultUrl, onChange, disabled, id = 'file-upload' } = props;
  const [selectedFile, setSelectedFile] = useState();
  const [preview, setPreview] = useState(defaultUrl);

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
        position: 'relative',
        overflow: 'hidden',
        padding: '6px',
        bgcolor: 'sky.lightest',
      }}>
      <FormLabel
        for={id}
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
        {!selectedFile && !defaultUrl && (
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
        id={id}
        type="file"
        disabled={disabled}
        sx={{ display: 'none' }}
        onChange={onSelectFile}
        inputProps={{ accept: '.jpg,.jpeg,.png' }}
      />
      {selectedFile ? (
        <Box
          sx={{
            position: 'relative',
            overflow: 'hidden',
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
          }}>
          <Button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setSelectedFile(undefined);
            }}
            sx={{
              position: 'absolute',
              right: 0,
              top: 0,
              zIndex: 101,
              color: 'primary.lightest',
              padding: '12px',
              borderRadius: 4,
              minWidth: 0,
            }}>
            <SvgIcon>
              <Delete></Delete>
            </SvgIcon>
          </Button>
          <Box
            component="img"
            src={preview}
            width="100%"
            height="100%"
            sx={{ objectFit: 'cover' }}
          />
        </Box>
      ) : (
        defaultUrl && (
          <Box
            sx={{
              overflow: 'hidden',
              width: '100%',
              height: '100%',
            }}>
            <Box
              component="img"
              src={defaultUrl}
              width="100%"
              height="100%"
              sx={{ objectFit: 'cover' }}
            />
          </Box>
        )
      )}
    </Box>
  );
};
