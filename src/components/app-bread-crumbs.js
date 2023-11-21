import React, { useMemo } from 'react';

import Link from 'next/link';
import { useRouter } from 'next/router';

import { Breadcrumbs, Typography } from '@mui/material';

const ROUTE_NAME_MAP = (name1, name2) => ({
  '/admin': 'Tổng quan',
  '/admin/users': 'Người dùng',
  '/admin/users/[user_id]': name1,
  '/admin/reports': 'Báo cáo',
  '/admin/reports/[report_id]': 'Chi tiết báo cáo',
  '/admin/reports/create': 'Tạo báo cáo mới',
  '/admin/stories': 'Truyện',
  '/admin/stories/[story_id]': name1,
  '/admin/stories/[story_id]/chapters': 'Danh sách chương',
  '/admin/stories/[story_id]/chapters/[chapter_id]': name2,
  '/admin/coin-packs': 'Quản lý gói xu',
  '/admin/coin-packs/[coinpack_id]': name1,
  '/admin/coin-packs/create': 'Tạo gói xu mới',
  '/admin/categories': 'Thể loại',
  '/admin/categories/[category_id]': name1,
  '/admin/categories/create': 'Tạo thể loại mới',
  '/admin/gifts': 'Quản lý quà',
  '/admin/gifts/[gift_id]': name1,
  '/admin/gifts/create': 'Tạo quà mới',
  '/admin/system-configs': 'Thông số hệ thống',
  '/admin/system-configs/[config_id]': name1,
  '/admin/system-configs/create': 'Tạo thông số hệ thống',
  '/admin/levels': 'Quản lý cấp',
  '/admin/levels/author': 'Tác giả',
  '/admin/levels/author/create': 'Tạo thông số hệ thống',
  '/admin/levels/author/[level_id]': name1,
});

const AppBreadCrumbs = ({ name1, name2 }) => {
  const router = useRouter();
  const paths = router.asPath.slice(1).split('/');
  const routes = router.route.slice(1).split('/');

  const breadcrums = useMemo(() => {
    const result = [];
    let accumulativeLink = '';
    let accumulativeRoute = '';

    paths.forEach((path, index) => {
      if (index !== 0) {
        result.push(
          <Link
            key={index}
            href={accumulativeLink}
            style={{ textDecoration: 'none' }}>
            <Typography
              variant="body1"
              sx={{
                fontSize: '16px',
                color: 'ink.main',
                ':hover': {
                  textDecoration: 'underline',
                },
              }}>
              {ROUTE_NAME_MAP(name1, name2)[accumulativeRoute]}
            </Typography>
          </Link>,
        );
      }
      accumulativeLink += '/' + path;
      accumulativeRoute += '/' + routes[index];
    }, '/');

    result.push(
      <Typography
        variant="body1"
        sx={{ fontSize: '16px', color: 'ink.lighter' }}>
        {ROUTE_NAME_MAP(name1, name2)[accumulativeRoute]}
      </Typography>,
    );
    return result;
  }, [name1, name2, paths, routes]);

  return (
    <Breadcrumbs separator="›" aria-label="breadcrumb">
      {breadcrums}
    </Breadcrumbs>
  );
};

export default AppBreadCrumbs;
