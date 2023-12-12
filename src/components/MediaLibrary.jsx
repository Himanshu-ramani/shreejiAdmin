/* eslint-disable react-hooks/exhaustive-deps */
// eslint-disable-next-line import/no-extraneous-dependencies
import Cropper from 'react-easy-crop';
import { useRef, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

// eslint-disable-next-line import/no-extraneous-dependencies
import { PartyModeOutlined } from '@mui/icons-material';
import {
  Box,
  Card,
  Stack,
  Badge,
  Button,
  Dialog,
  Checkbox,
  CardMedia,
  TextField,
  Typography,
  DialogTitle,
  CardContent,
  DialogActions,
  DialogContent,
} from '@mui/material';

import { updateData } from 'src/redux/slice/dataSlice';
import { apiCall, isObjWithValues, isArrayWithValues } from 'src/helper';

import Label from './label/label';

// eslint-disable-next-line react/prop-types
const MediaLibrary = ({ handleClose, open, getImages, ratioSet }) => {
  const [medias, setMedias] = useState([]);
  const [selected, setSelected] = useState([]);
  const reduxMedia = useSelector((state) => state?.data?.medias);
  const dispatch = useDispatch();
  // const [selectedImage, setSelectedImages] = useState([]);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [ratio, setRatio] = useState(3 / 4);
  const [image, setImage] = useState(null);
  const inputRef = useRef(null);
  const setUpMedias = async () => {
    const res = await apiCall({
      endpoint: 'api/media',
    });
    if (isArrayWithValues(res)) {
      setMedias(res);
      dispatch(updateData({ medias: res }));
    }
  };
  const onCropComplete = (croppedArea, croppedAreaPixelsArg) => {
    setCroppedAreaPixels(croppedAreaPixelsArg);
  };

  const handleCrop = async () => {
    // Crop the image using the croppedAreaPixels
    // This code assumes 'image' is set when an image is selected
    if (image && croppedAreaPixels) {
      const canvas = document.createElement('canvas');
      const img = new Image();
      img.src = image;
      const scaleX = img.naturalWidth / img.width;
      const scaleY = img.naturalHeight / img.height;

      canvas.width = croppedAreaPixels.width;
      canvas.height = croppedAreaPixels.height;
      const ctx = canvas.getContext('2d');

      ctx.drawImage(
        img,
        croppedAreaPixels.x * scaleX,
        croppedAreaPixels.y * scaleY,
        croppedAreaPixels.width * scaleX,
        croppedAreaPixels.height * scaleY,
        0,
        0,

        canvas.width,
        canvas.height
      );

      // Convert cropped image to Blob format
      canvas.toBlob(async (blob) => {
        // Now, you can upload 'blob' using Axios
        try {
          const selectedFileInput = document.querySelector('input[type="file"]');
          const originalFileName = selectedFileInput.files[0].name;
          const formData = new FormData();
          formData.append('file', blob, originalFileName);

          // Example: Replace 'uploadUrl' with your actual upload URL

          const res = await apiCall({
            method: 'POST',
            endpoint: 'api/media/upload',
            data: formData,
          });
          if (isObjWithValues(res)) {
            setImage(null);
            setMedias((pre) => [res, ...pre]);
            dispatch(updateData({ medias: [res, ...medias] }));
          }

          console.log('Image uploaded successfully!');
        } catch (error) {
          console.error('Error uploading image:', error);
        }
      }, 'image/jpeg');
    }
  };

  useEffect(() => {
    if (!isArrayWithValues(reduxMedia)) setUpMedias();
    return () => {};
  }, []);
  useEffect(() => {
    setMedias(reduxMedia || []);

    return () => {};
  }, [reduxMedia]);
  useEffect(() => {
    if (ratioSet) setRatio(ratioSet);
    return () => {};
  }, [ratioSet]);

  const onChangeFiles = (e) => {
    const selectedImage = e.target.files[0];
    const reader = new FileReader();

    reader.onload = () => {
      setImage(reader.result);
    };

    if (selectedImage) {
      reader.readAsDataURL(selectedImage);
    }
  };
  const onSelect = (file) =>
    setSelected((pre) =>
      pre?.find((f) => f.name === file.name)
        ? pre?.filter((f) => f?.name !== file?.name)
        : [...pre, file]
    );

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      maxWidth="md"
      fullWidth
    >
      <input
        style={{ display: 'none' }}
        type="file"
        accept="image/*"
        ref={inputRef}
        // multiple
        onChange={onChangeFiles}
      />
      <DialogTitle id="alert-dialog-title">Media Library</DialogTitle>
      <DialogContent>
        {!image ? (
          <Stack justifyContent="center" gap={1.5} mb={4}>
            <Stack direction="row" justifyContent="space-between" gap={1}>
              <Typography variant="h6">Upload Image</Typography>
            </Stack>
            <Stack
              sx={{
                borderRadius: 1,
                border: 'dashed',
                height: '200px',
                // width: '150px',
                borderColor: 'grey.500',
                borderWidth: 2,
                cursor: 'pointer',
              }}
              justifyContent="center"
              alignItems="center"
              gap={1}
              onClick={() => inputRef.current.click()}
            >
              <PartyModeOutlined color="grey.400" />
              <Typography>Select Images</Typography>
            </Stack>
          </Stack>
        ) : (
          <Box>
            <Box
              sx={{
                height: 300,
                width: '100%',
                position: 'relative',
                borderRadius: 2,
                overflow: 'hidden',
              }}
            >
              <Cropper
                image={image}
                crop={crop}
                zoom={zoom}
                aspect={ratio}
                onCropChange={setCrop}
                onCropComplete={onCropComplete}
                onZoomChange={setZoom}
              />
            </Box>
            <Stack direction="row" alignItems="center" gap={2} justifyContent="end" my={2}>
              <TextField
                label="Ratio"
                size="small"
                value={ratio}
                onChange={(e) => setRatio(e.target.value)}
                type="number"
              />
              <Button onClick={() => setImage(null)}>Cancel</Button>
              <Button variant="contained" onClick={handleCrop}>
                Upload
              </Button>
            </Stack>
          </Box>
        )}

        <Stack direction="row" alignItems="center" flexWrap="wrap" gap={2} justifyContent="center">
          {medias?.map((obj) => (
            <Badge
              key={obj?.name}
              badgeContent={
                <Checkbox checked={Boolean(selected?.find((f) => f?.name === obj?.name))} />
              }
              sx={{ '.MuiBadge-badge': { top: 12, right: 14 } }}
            >
              <Card sx={{ borderRadius: 1, width: '150px' }} onClick={() => onSelect(obj)}>
                <CardMedia
                  image={obj?.url}
                  title={obj?.name}
                  sx={{ width: 'auto', height: '200px', Width: '150px' }}
                />
                <CardContent>
                  <Stack direction="row" alignItems="center" justifyContent="space-between" gap={3}>
                    <Typography variant="caption" noWrap>
                      {obj?.name}
                    </Typography>
                  </Stack>
                  <Stack justifyContent="end" direction="row">
                    <Label>{obj?.contentType}</Label>
                  </Stack>
                </CardContent>
              </Card>{' '}
            </Badge>
          ))}
        </Stack>

        {/* <Grid container spacing={2} rowSpacing={3}>
          {medias?.map((obj) => (
            <Grid item xs={12} md={3} key={obj?.name}>
             

              <Card sx={{ borderRadius: 1 }}>
                <CardMedia
                  image={obj?.url}
                  title={obj?.name}
                  sx={{ width: '100%', height: '200px' }}
                />
                <CardContent></CardContent>
              </Card>
            </Grid>
          ))}
        </Grid> */}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Close</Button>
        <Button
          onClick={() => {
            handleClose();
            // eslint-disable-next-line no-unused-expressions
            getImages && getImages(selected, open);
          }}
          autoFocus
        >
          Select
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default MediaLibrary;
