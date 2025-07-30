import * as React from 'react';
import { Button } from '@mui/material';
import Link from 'next/link';
import { useTranslate } from 'react-admin';
import { stringify } from 'query-string';

import visitors from '../visitors';

const LinkToRelatedCustomers = ({ segment }: { segment: string }) => {
    const translate = useTranslate();
    return (
        <Link
            href={`/admin/customers?${stringify({
                filter: JSON.stringify({ groups: segment }),
            })}`}
            passHref
        >
            <Button
                size="small"
                color="primary"
                sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                }}
            >
                <visitors.icon sx={{ paddingRight: '0.5em' }} />
                {translate('resources.segments.fields.customers')}
            </Button>
        </Link>
    );
};

export default LinkToRelatedCustomers;
