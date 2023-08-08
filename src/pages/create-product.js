// import { useCallback, useMemo, useState } from "react";
// import Head from "next/head";
// import PlusIcon from "@heroicons/react/24/solid/PlusIcon";
// import NextLink from "next/link";

// import {
//   Box,
//   Button,
//   Card,
//   Container,
//   InputAdornment,
//   OutlinedInput,
//   Stack,
//   SvgIcon,
//   Typography,
// } from "@mui/material";
// import { useSelection } from "src/hooks/use-selection";
// import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
// import { ProductsTable } from "src/sections/product/products-table";
// import { applyPagination } from "src/utils/apply-pagination";
// import { useQuery } from "react-query";
// import axios from "axios";
// import useDebounce from "../hooks/use-debounce";
// import MagnifyingGlassIcon from "@heroicons/react/24/solid/MagnifyingGlassIcon";

// const Page = () => {
//   const [product, setProduct] = useState({
//     name: "",
//     price: null,
//     provider: "Shopee",
//     link: "",
//     location: "",
//     isMall: false,
//     description: "",
//     discountedPrice: null,
//   });

//   return (
//     <>
//       <Head>
//         <title>Product | Pricible</title>
//       </Head>
//       <Box
//         component="main"
//         sx={{
//           flexGrow: 1,
//           py: 8,
//         }}
//       >
//         <Container maxWidth="xl">
//           <Stack spacing={3}>
//             <Stack direction="row" justifyContent="space-between" spacing={4}>
//               <Stack spacing={1}>
//                 <Typography variant="h4">Sản phẩm</Typography>
//                 <Stack alignItems="center" direction="row" spacing={1}></Stack>
//               </Stack>
//               <div>
//                 <Button
//                   component={NextLink}
//                   href="create-product"
//                   onClick={() => {}}
//                   startIcon={
//                     <SvgIcon fontSize="small">
//                       <PlusIcon />
//                     </SvgIcon>
//                   }
//                   variant="contained"
//                 >
//                   Add
//                 </Button>
//               </div>
//             </Stack>

//             <Stack>
//             <TextField
//                     fullWidth
//                     label="Email"
//                     name="email"
//                     onBlur={}
//                     onChange={}
//                     type="email"
//                     value={}
//                   />
//                   <TextField
//                     error={!!(formik.touched.password && formik.errors.password)}
//                     fullWidth
//                     helperText={formik.touched.password && formik.errors.password}
//                     label="Mật khẩu"
//                     name="password"
//                     onBlur={}
//                     onChange={}
//                     type="password"
//                     value={formik.values.password}
//                   />
//             </Stack>
//           </Stack>
//         </Container>
//       </Box>
//     </>
//   );
// };

// Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

// export default Page;
