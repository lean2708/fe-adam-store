import * as React from 'react';
import Button from '@mui/material/Button';
import Link from 'next/link';
import { useTranslate, useRecordContext } from 'react-admin';
import { stringify } from 'query-string';

import products from '../products';
import { Category } from '../types';

const LinkToRelatedProducts = () => {
    const record = useRecordContext<Category>();
    const translate = useTranslate();
    if (!record) return null;
    return (
        <Link
            href={`/admin/products?${stringify({
                filter: JSON.stringify({ category_id: record.id }),
            })}`}
            passHref
        >
            <Button
                size="small"
                color="primary"
                sx={{ display: 'inline-flex', alignItems: 'center' }}
            >
                <products.icon sx={{ paddingRight: '0.5em' }} />
                {translate('resources.categories.fields.products')}
            </Button>
        </Link>
    );
};

export default LinkToRelatedProducts;
