import * as React from 'react';
import {
    ListItem,
    ListItemAvatar,
    ListItemText,
    Avatar,
    Box,
    ListItemButton,
} from '@mui/material';
import Link from 'next/link';
import { useTranslate, useReference } from 'react-admin';

import { Customer, Order } from '../types';

interface Props {
    order: Order;
}

export const PendingOrder = (props: Props) => {
    const { order } = props;
    const translate = useTranslate();
    const { referenceRecord: customer, isPending } = useReference<Customer>({
        reference: 'customers',
        id: order.customer_id || 0,
    });

    return (
        <ListItem disablePadding>
            <Link href={`/admin/orders/${order.id}`} passHref>
                <ListItemButton>
                <ListItemAvatar>
                    {isPending ? (
                        <Avatar />
                    ) : (
                        <Avatar
                            src={`${customer?.avatar}?size=32x32`}
                            sx={{ bgcolor: 'background.paper' }}
                            alt={`${customer?.first_name} ${customer?.last_name}`}
                        />
                    )}
                </ListItemAvatar>
                <ListItemText
                    primary={new Date(order.date || new Date()).toLocaleString('en-GB')}
                    secondary={translate('pos.dashboard.order.items', {
                        smart_count: order.basket?.length || 0,
                        nb_items: order.basket?.length || 0,
                        customer_name: customer
                            ? `${customer.first_name} ${customer.last_name}`
                            : '',
                    })}
                />
                <Box
                    component="span"
                    sx={{
                        marginLeft: 'auto',
                        marginRight: '1em',
                        color: 'text.primary',
                    }}
                >
                    {order.total}$
                </Box>
            </ListItemButton>
            </Link>
        </ListItem>
    );
};
