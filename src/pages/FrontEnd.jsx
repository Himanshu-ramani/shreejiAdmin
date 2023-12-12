/* eslint-disable react-hooks/exhaustive-deps */
import { Helmet } from 'react-helmet-async';
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { LoadingButton } from '@mui/lab';
import { AddAPhotoOutlined, PhotoCameraBackOutlined } from '@mui/icons-material';
import {
  Card,
  Grid,
  Stack,
  Button,
  useTheme,
  CardMedia,
  Container,
  TextField,
  Typography,
  CardContent,
  useMediaQuery,
} from '@mui/material';

import { apiCall, isObjWithValues } from 'src/helper';
import { updateData } from 'src/redux/slice/dataSlice';

import MediaLibrary from 'src/components/MediaLibrary';

export default function FrontEnd() {
  const [bannerState, setBannerState] = useState({});
  const [updating, setUpdating] = useState(false);
  const [openMedia, setOpenMedia] = useState(false);
  const [ratio, setRatio] = useState(null);
  const reduxSettings = useSelector((state) => state?.data?.home);
  const dispatch = useDispatch();
  const theme = useTheme();
  const isIpad = useMediaQuery(theme.breakpoints.down('md'));
  const setUpSettings = async () => {
    const res = await apiCall({
      endpoint: 'api/settings/home',
    });
    if (isObjWithValues(res?.data) && res?.success) {
      dispatch(updateData({ home: res?.data }));
    }
  };
  const updateSetting = async () => {
    setUpdating(true);
    await apiCall({
      endpoint: 'api/settings/home',
      method: 'POST',
      data: { data: bannerState },
    });
    setUpdating(false);
  };

  const editBanner = (payload, index) => {
    setBannerState((pre) => {
      // eslint-disable-next-line no-unsafe-optional-chaining
      const oldBanner = [...(pre?.banner || [])];

      oldBanner[index] = { ...(pre?.banner?.[index] || []), ...payload };

      return { ...pre, banner: oldBanner };
    });
  };
  const editBanner2 = (payload, index) => {
    setBannerState((pre) => {
      // eslint-disable-next-line no-unsafe-optional-chaining
      const oldBanner = [...(pre?.banner_2 || [])];

      oldBanner[index] = { ...(pre?.banner_2?.[index] || []), ...payload };

      return { ...pre, banner_2: oldBanner };
    });
  };
  useEffect(() => {
    if (!isObjWithValues(reduxSettings)) setUpSettings();
    return () => {};
  }, []);
  useEffect(() => {
    if (isObjWithValues(reduxSettings)) setBannerState(reduxSettings);
    return () => {};
  }, [reduxSettings]);
  const handleClose = () => setOpenMedia(false);

  const updateImage = (images, opt) => {
    const file = images[0];
    const arr = opt?.split('_');
    if (arr[0] === 'banner') editBanner({ image: file?.url }, arr[1]);
    if (arr[0] === 'banner2') editBanner2({ image: file?.url }, arr[1]);
  };

  return (
    <>
      <Helmet>
        <title> Frontend </title>
      </Helmet>
      <Container>
        {openMedia && (
          <MediaLibrary
            open={openMedia}
            handleClose={handleClose}
            getImages={updateImage}
            ratioSet={ratio}
          />
        )}
        <Stack direction="row" justifyContent="space-between" alignItems="center" my={3}>
          <Typography variant="h4">Home Banner</Typography>
          <LoadingButton variant="contained" onClick={updateSetting} loading={updating}>
            Update{' '}
          </LoadingButton>
        </Stack>
        <Stack gap={2}>
          {bannerState?.banner?.map((obj, index) => (
            <Card key={obj?.id} sx={{ width: isIpad ? '100%' : '80%' }}>
              <CardContent>
                <Stack direction="row" justifyContent="space-between" gap={2}>
                  <Stack gap={2} sx={{ width: '100%' }} direction="column" alignItems="baseline">
                    <TextField
                      label="Title"
                      value={obj?.title || ''}
                      onChange={(e) => editBanner({ title: e.target.value }, index)}
                    />
                    <TextField
                      label="Sub-Title"
                      fullWidth
                      value={obj?.subtitle || ''}
                      onChange={(e) => editBanner({ subtitle: e.target.value }, index)}
                    />
                    <Button
                      variant="outlined"
                      startIcon={<PhotoCameraBackOutlined />}
                      onClick={() => {
                        setOpenMedia(`banner_${index}`);
                        setRatio(1);
                      }}
                    >
                      Select Banner
                    </Button>
                  </Stack>
                  <CardMedia
                    component="img"
                    sx={{ width: 200, height: 200 }}
                    image={obj?.image}
                    alt={obj?.title}
                  />
                </Stack>
              </CardContent>
            </Card>
          ))}
        </Stack>
        <Typography variant="h4" my={4}>
          Banner 2
        </Typography>
        <Grid container spacing={2}>
          {bannerState?.banner_2?.map((o, index) => (
            <Grid item xs={12} md={6} key={o?.id}>
              <Card>
                <CardContent>
                  <Stack direction="column" gap={2} justifyContent="center" alignItems="center">
                    <CardMedia
                      component="img"
                      sx={{ width: 'auto', height: 200 }}
                      image={o?.image}
                      alt={o?.image}
                    />
                    <Button
                      variant="outlined"
                      startIcon={<AddAPhotoOutlined />}
                      onClick={() => {
                        setOpenMedia(`banner2_${index}`);
                        setRatio(1.91);
                      }}
                    >
                      Select Banner
                    </Button>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </>
  );
}
