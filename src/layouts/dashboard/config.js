import BankNotesIcon from '@heroicons/react/24/outline/BankNotesIcon';
import BookOpenIcon from '@heroicons/react/24/outline/BookOpenIcon';
import ChartBarIcon from '@heroicons/react/24/outline/ChartBarIcon';
import CircleStackIcon from '@heroicons/react/24/outline/CircleStackIcon';
import Cog8ToothIcon from '@heroicons/react/24/outline/Cog8ToothIcon';
import FlagIcon from '@heroicons/react/24/outline/FlagIcon';
import GiftIcon from '@heroicons/react/24/outline/GiftIcon';
import RectangleStackIcon from '@heroicons/react/24/outline/RectangleStackIcon';
import UserCircleIcon from '@heroicons/react/24/outline/UserCircleIcon';
import UsersIcon from '@heroicons/react/24/outline/UsersIcon';
import { SvgIcon } from '@mui/material';

export const items = [
  {
    title: 'Tổng quan',
    path: '/admin',
    icon: (
      <SvgIcon fontSize="small">
        <ChartBarIcon />
      </SvgIcon>
    ),
  },
  {
    title: 'Quản lý báo cáo',
    path: '/admin/reports',
    icon: (
      <SvgIcon fontSize="small">
        <FlagIcon />
      </SvgIcon>
    ),
  },
  {
    title: 'Quản lý người dùng',
    path: '/admin/users',
    icon: (
      <SvgIcon fontSize="small">
        <UsersIcon />
      </SvgIcon>
    ),
  },
  {
    title: 'Quản lý truyện',
    path: '/admin/stories',
    icon: (
      <SvgIcon fontSize="small">
        <BookOpenIcon />
      </SvgIcon>
    ),
  },
  {
    title: 'Quản lý thể loại',
    path: '/admin/categories',
    icon: (
      <SvgIcon fontSize="small">
        <RectangleStackIcon />
      </SvgIcon>
    ),
  },
  {
    title: 'Quản lý gói xu',
    path: '/admin/coinpacks',
    icon: (
      <SvgIcon fontSize="small">
        <CircleStackIcon />
      </SvgIcon>
    ),
  },
  {
    title: 'Quản lý quà',
    path: '/admin/gifts',
    icon: (
      <SvgIcon fontSize="small">
        <GiftIcon />
      </SvgIcon>
    ),
  },
  {
    title: 'Quản lý giao dịch',
    path: '/admin/transactions',
    icon: (
      <SvgIcon fontSize="small">
        <BankNotesIcon />
      </SvgIcon>
    ),
  },
  {
    title: 'Thông số hệ thống',
    path: '/admin/system-configs',
    icon: (
      <SvgIcon fontSize="small">
        <Cog8ToothIcon />
      </SvgIcon>
    ),
  },
  {
    title: 'Hồ sơ bản thân',
    path: '/admin/me',
    icon: (
      <SvgIcon fontSize="small">
        <UserCircleIcon />
      </SvgIcon>
    ),
  },
  // {
  //   title: 'Số liệu tác giả',
  //   path: '/author-dashboard',
  //   icon: (
  //     <SvgIcon fontSize="small">
  //       <ChartBarIcon />
  //     </SvgIcon>
  //   ),
  // },
];
