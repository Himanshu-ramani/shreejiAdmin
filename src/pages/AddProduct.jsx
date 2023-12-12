/* eslint-disable react-hooks/exhaustive-deps */
// eslint-disable-next-line import/no-duplicates
import { useEffect } from 'react';
// eslint-disable-next-line import/no-duplicates
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';

import { LoadingButton } from '@mui/lab';
// eslint-disable-next-line import/no-extraneous-dependencies
import { Close, PartyModeOutlined } from '@mui/icons-material';
import {
  Card,
  Grid,
  Chip,
  Stack,
  Badge,
  Rating,
  Container,
  TextField,
  CardMedia,
  Typography,
  IconButton,
  CardContent,
  Autocomplete,
  FormHelperText,
} from '@mui/material';

import { updateData } from 'src/redux/slice/dataSlice';
import { apiCall, isObjWithValues, isArrayWithValues } from 'src/helper';

import MediaLibrary from 'src/components/MediaLibrary';

const AddProduct = () => {
  const { id } = useParams();
  const [openMedia, setOpenMedia] = useState(false);
  const [productObj, setProductObj] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const handleClose = () => setOpenMedia(false);
  const editProduct = (payload) => setProductObj((pre) => ({ ...pre, ...payload }));
  const reduxProducts = useSelector((state) => state?.data?.products);
  const dispatch = useDispatch();
  const createProduct = async () => {
    setLoading(true);
    const res = await apiCall({ method: 'POST', data: productObj, endpoint: 'api/products' });
    if (isObjWithValues(res)) {
      if (isArrayWithValues(reduxProducts))
        dispatch(updateData({ products: [res, ...(reduxProducts || [])] }));
      navigate('/products');
    }
    setLoading(false);
    console.log(productObj);
  };
  const updateProduct = async () => {
    const res = await apiCall({
      method: 'PUT',
      endpoint: `api/products/${id}`,
      data: productObj,
    });
    if (isObjWithValues(res)) {
      if (isArrayWithValues(reduxProducts))
        dispatch(
          updateData({ products: reduxProducts?.map((o) => (o?.id === res?.id ? res : o)) })
        );
      navigate('/products');
    }
  };

  const setupProduct = async () => {
    if (id !== 'Add') {
      const prod = reduxProducts?.find((o) => o?.id === id);
      if (!prod) {
        const fetchProd = await apiCall({ endpoint: `api/products/find/${id}` });
        if (fetchProd) setProductObj(fetchProd || {});
        else navigate('/404');
      } else {
        setProductObj(prod);
      }
    }
  };
  useEffect(() => {
    setupProduct();
    return () => {};
  }, [id]);

  return (
    <Container>
      <MediaLibrary
        open={openMedia}
        handleClose={handleClose}
        getImages={(images) => editProduct({ image: images?.map((o) => o?.url) })}
      />
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 5 }}>
        <Typography variant="h4">{} Product</Typography>
        <LoadingButton
          loading={loading}
          variant="contained"
          onClick={id !== 'Add' ? updateProduct : createProduct}
        >
          {id !== 'Add' ? 'Update' : 'Add'} Product
        </LoadingButton>
      </Stack>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6">Description</Typography>
              <Stack gap={2} my={2} sx={{ border: 'divider' }}>
                <TextField
                  fullWidth
                  label="Product Name"
                  value={productObj.name || ''}
                  onChange={(e) => editProduct({ name: e.target.value })}
                />
                <TextField
                  fullWidth
                  label="Sort Descriptions"
                  multiline
                  rows={2}
                  value={productObj.shortDescription || ''}
                  onChange={(e) => editProduct({ shortDescription: e.target.value })}
                />
                <TextField
                  fullWidth
                  label="Description"
                  multiline
                  rows={5}
                  value={productObj.fullDescription || ''}
                  onChange={(e) => editProduct({ fullDescription: e.target.value })}
                />
              </Stack>
              <Typography variant="h6">Category & Tags</Typography>
              <Stack gap={2} my={2}>
                <Stack>
                  <Autocomplete
                    multiple
                    id="tags-filled"
                    options={[]}
                    value={productObj.category || []}
                    onChange={(e, newValue) => editProduct({ category: newValue })}
                    freeSolo
                    renderTags={(value, getTagProps) =>
                      value?.map((option, index) => (
                        <Chip variant="filled" label={option} {...getTagProps({ index })} />
                      ))
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Category"
                        placeholder="Rings, Neckless Etc..."
                      />
                    )}
                  />
                  <FormHelperText>Hit Enter to Add Category</FormHelperText>
                </Stack>
                <Stack>
                  <Autocomplete
                    multiple
                    id="tags-filled"
                    freeSolo
                    options={[]}
                    value={productObj.tag || []}
                    onChange={(e, newValue) => editProduct({ tag: newValue })}
                    renderTags={(value, getTagProps) =>
                      value?.map((option, index) => (
                        <Chip variant="filled" label={option} {...getTagProps({ index })} />
                      ))
                    }
                    renderInput={(params) => (
                      <TextField {...params} label="Tags" placeholder="Wedding, Birthday Etc..." />
                    )}
                  />
                  <FormHelperText>Hit Enter to Add Category</FormHelperText>
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6">Product Image</Typography>
              <Stack
                my={2}
                sx={{ border: 0.6, borderColor: 'grey.400', borderRadius: 1, p: 3 }}
                gap={1.5}
                direction="row"
                flexWrap="wrap"
              >
                <Stack direction="row" alignItems="center" gap={3} flexWrap="wrap">
                  <Stack
                    sx={{
                      borderRadius: 1,
                      border: 'dashed',
                      height: '200px',
                      width: '150px',
                      borderColor: 'grey.500',
                      borderWidth: 2,
                      cursor: 'pointer',
                    }}
                    justifyContent="center"
                    alignItems="center"
                    gap={1}
                    onClick={() => setOpenMedia(true)}
                  >
                    <PartyModeOutlined color="grey.400" />
                    <Typography>Select Images</Typography>
                  </Stack>
                </Stack>{' '}
                {productObj?.image?.map((str) => (
                  <Badge
                    key={str}
                    badgeContent={
                      <IconButton
                        onClick={() =>
                          setProductObj((pre) => ({
                            ...pre,
                            image: pre?.image?.filter((s) => s !== str),
                          }))
                        }
                      >
                        <Close />
                      </IconButton>
                    }
                    sx={{ '.MuiBadge-badge': { top: 12, right: 14 } }}
                  >
                    <Card sx={{ borderRadius: 1, width: '150px' }}>
                      <CardMedia
                        image={str}
                        title={str}
                        sx={{ width: 'auto', height: '200px', Width: '150px' }}
                      />
                    </Card>
                  </Badge>
                ))}
              </Stack>
              <Typography variant="h6">Product Sales Point</Typography>
              <Stack my={2} gap={2}>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <TextField
                      label="Price"
                      fullWidth
                      value={productObj.price || ''}
                      onChange={(e) => editProduct({ price: e.target.value })}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      label="Discount"
                      fullWidth
                      value={productObj.discount || ''}
                      onChange={(e) => editProduct({ discount: e.target.value })}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      label="SKU"
                      fullWidth
                      value={productObj.sku || ''}
                      onChange={(e) => editProduct({ sku: e.target.value })}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      label="Offer End"
                      fullWidth
                      value={productObj.offerEnd || ''}
                      onChange={(e) => editProduct({ offerEnd: e.target.value })}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      label="Stock"
                      type="number"
                      fullWidth
                      value={productObj.stock || ''}
                      onChange={(e) => editProduct({ stock: e.target.value })}
                    />
                  </Grid>
                </Grid>
                <Stack>
                  <Typography component="legend">Ratings</Typography>
                  <Rating
                    value={productObj.rating || 0}
                    onChange={(e, newValue) => editProduct({ rating: newValue })}
                  />
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default AddProduct;
