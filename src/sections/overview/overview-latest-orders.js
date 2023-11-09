import { useCallback, useMemo, useState } from 'react';

import { Card, CardHeader } from '@mui/material';
import axios from 'axios';
import PropTypes from 'prop-types';
import { useQuery } from 'react-query';

import useDebounce from '@/hooks/use-debounce';
import { applyPagination } from '@/utils/apply-pagination';

import { OrderTable } from '../order/order-table';

const useOrders = (data, page, rowsPerPage) => {
  return useMemo(() => {
    return applyPagination(data, page, rowsPerPage);
  }, [page, rowsPerPage, data.length]);
};

export const OverviewLatestOrders = (props) => {
  const { sx } = props;
  const { data = [] } = useQuery(['orders'], async () => {
    const res = await axios.get(
      'https://pricible.azurewebsites.net/api/Order?' +
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
  const orders = useOrders(
    data.filter(
      (item) =>
        item.maDon.includes(debounceSearchValue) ||
        item.provider.includes(debounceSearchValue),
    ),
    page,
    rowsPerPage,
  );

  const handlePageChange = useCallback((event, value) => {
    setPage(value);
  }, []);

  const handleRowsPerPageChange = useCallback((event) => {
    setRowsPerPage(event.target.value);
  }, []);

  return (
    <Card sx={sx}>
      <CardHeader title="Đơn hàng" />

      <OrderTable
        count={data.length}
        items={orders}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
        page={page}
        rowsPerPage={rowsPerPage}
      />
    </Card>
  );
};

OverviewLatestOrders.prototype = {
  orders: PropTypes.array,
  sx: PropTypes.object,
};
