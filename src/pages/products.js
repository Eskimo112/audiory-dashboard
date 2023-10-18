import { useCallback, useMemo, useState } from 'react';

import Head from 'next/head';
import NextLink from 'next/link';

import MagnifyingGlassIcon from '@heroicons/react/24/solid/MagnifyingGlassIcon';
import PlusIcon from '@heroicons/react/24/solid/PlusIcon';
import {
  Box,
  Button,
  Card,
  Container,
  InputAdornment,
  OutlinedInput,
  Stack,
  SvgIcon,
  Typography,
} from '@mui/material';
import axios from 'axios';
import { useQuery } from 'react-query';
import { useSelection } from 'src/hooks/use-selection';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import { ProductsTable } from 'src/sections/product/products-table';
import { applyPagination } from 'src/utils/apply-pagination';

import useDebounce from '../hooks/use-debounce';

const now = new Date();

const useProducts = (data, page, rowsPerPage) => {
  return useMemo(() => {
    return applyPagination(data, page, rowsPerPage);
  }, [page, rowsPerPage, data.length]);
};

const useProductIds = (products) => {
  return useMemo(() => {
    return products.map((product) => product.id);
  }, [products]);
};

const Page = () => {
  const { data = [] } = useQuery(['products'], async () => {
    const res = await axios.get(
      'https://pricible.azurewebsites.net/api/Product?' +
        new URLSearchParams({
          pageSize: 10000000,
        }),
    );
    return res.data.data;
  });
  const [page, setPage] = useState(0);
  const [searchValue, setSearchValue] = useState('');
  const debounceSearchValue = useDebounce(searchValue, 500);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const products = useProducts(
    data.filter(
      (item) =>
        item.name.includes(debounceSearchValue) ||
        item.link.includes(debounceSearchValue) ||
        item.provider.includes(debounceSearchValue),
    ),
    page,
    rowsPerPage,
  );
  const productsIds = useProductIds(products);
  const productsSelection = useSelection(productsIds);

  const handlePageChange = useCallback((event, value) => {
    setPage(value);
  }, []);

  const handleRowsPerPageChange = useCallback((event) => {
    setRowsPerPage(event.target.value);
  }, []);
  return (
    <>
      <Head>
        <title>Product | Pricible</title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}>
        <Container maxWidth="xl">
          <Stack spacing={3}>
            <Stack direction="row" justifyContent="space-between" spacing={4}>
              <Stack spacing={1}>
                <Typography variant="h4">Tạo Sản phẩm</Typography>
                <Stack alignItems="center" direction="row" spacing={1}></Stack>
              </Stack>
              <div>
                <Button
                  onClick={() => {}}
                  startIcon={
                    <SvgIcon fontSize="small">
                      <PlusIcon />
                    </SvgIcon>
                  }
                  variant="contained">
                  Add
                </Button>
              </div>
            </Stack>
            <Card sx={{ p: 2 }}>
              <OutlinedInput
                defaultValue=""
                fullWidth
                placeholder="Tìm kiếm sản phẩm"
                onChange={(e) => setSearchValue(e.target.value)}
                startAdornment={
                  <InputAdornment position="start">
                    <SvgIcon color="action" fontSize="small">
                      <MagnifyingGlassIcon />
                    </SvgIcon>
                  </InputAdornment>
                }
                sx={{ maxWidth: 500 }}
              />
            </Card>

            <ProductsTable
              count={data.length}
              items={products}
              onDeselectAll={productsSelection.handleDeselectAll}
              onDeselectOne={productsSelection.handleDeselectOne}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleRowsPerPageChange}
              onSelectAll={productsSelection.handleSelectAll}
              onSelectOne={productsSelection.handleSelectOne}
              page={page}
              rowsPerPage={rowsPerPage}
              selected={productsSelection.selected}
            />
          </Stack>
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
