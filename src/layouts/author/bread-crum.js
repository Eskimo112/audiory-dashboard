import * as React from 'react';

import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import { useRouter } from 'next/router';

function handleClick(event) {
    event.preventDefault();
    console.info('You clicked a breadcrumb.');
}

export default function AuthorBreadcrum() {
    const router = useRouter();
    console.log(router.pathname);
    console.log(router.basePath);
    return (
        <div role="presentation" onClick={handleClick} >
            {router.pathname === '/my-works/[id]' ? <>
                <Breadcrumbs sx={{ marginX: "1em" }} aria-label="breadcrumb">
                    <Typography underline="hover" color="inherit" onClick={() => { router.push('/my-works') }}>
                        Truyện của tôi
                    </Typography>
                    <Link
                        underline="hover"
                        color="primary"
                        href={router.query.id}
                    >
                        {router.query.id}
                    </Link>
                </Breadcrumbs>

            </> : <></>}


        </div>
    );
}
