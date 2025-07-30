import * as React from 'react';
import { useCallback } from 'react';
import {
    CreateButton,
    ExportButton,
    FilterButton,
    List,
    ColumnsButton,
    TopToolbar,
    useDefaultTitle,
    useListContext,
} from 'react-admin';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { Box, Drawer, useMediaQuery, Theme } from '@mui/material';

import ReviewListMobile from './ReviewListMobile';
import ReviewListDesktop from './ReviewListDesktop';
import reviewFilters from './reviewFilters';
import ReviewEdit from './ReviewEdit';

const ReviewListActions = () => (
    <TopToolbar>
        <FilterButton />
        <CreateButton />
        <ColumnsButton />
        <ExportButton />
    </TopToolbar>
);

const ReviewsTitle = () => {
    const title = useDefaultTitle();
    const { defaultTitle } = useListContext();
    return (
        <>
            <title>{`${title} - ${defaultTitle}`}</title>
            <span>{defaultTitle}</span>
        </>
    );
};

const ReviewList = () => {
    const isXSmall = useMediaQuery<Theme>(theme =>
        theme.breakpoints.down('sm')
    );
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const handleClose = useCallback(() => {
        router.push('/admin/reviews');
    }, [router]);

    // Simple pattern matching for Next.js routes
    const match = pathname.match(/\/admin\/reviews\/(\d+)$/);
    const matchedId = match ? match[1] : null;

    return (
        <Box
            sx={{
                display: 'flex',
            }}
        >
            <List
                sx={{
                    flexGrow: 1,
                    transition: (theme: any) =>
                        theme.transitions.create(['all'], {
                            duration: theme.transitions.duration.enteringScreen,
                        }),
                    marginRight: matchedId ? '400px' : 0,
                }}
                filters={reviewFilters}
                perPage={25}
                sort={{ field: 'date', order: 'DESC' }}
                actions={<ReviewListActions />}
                title={<ReviewsTitle />}
            >
                {isXSmall ? (
                    <ReviewListMobile />
                ) : (
                    <ReviewListDesktop
                        selectedRow={
                            matchedId
                                ? parseInt(matchedId, 10)
                                : undefined
                        }
                    />
                )}
            </List>
            <Drawer
                variant="persistent"
                open={!!matchedId}
                anchor="right"
                onClose={handleClose}
                sx={{ zIndex: 100 }}
            >
                {/* To avoid any errors if the route does not match, we don't render at all the component in this case */}
                {!!matchedId && (
                    <ReviewEdit
                        id={matchedId}
                        onCancel={handleClose}
                    />
                )}
            </Drawer>
        </Box>
    );
};

export default ReviewList;
