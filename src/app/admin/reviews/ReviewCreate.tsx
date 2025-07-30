import * as React from 'react';
import {
    SimpleForm,
    Create,
    ReferenceInput,
    TextInput,
    DateInput,
    AutocompleteInput,
    required,
    useNotify,
    useRedirect,
    getRecordFromLocation,
    useDefaultTitle,
    useCreateContext,
} from 'react-admin';
import { useSearchParams } from 'next/navigation';

import StarRatingInput from './StarRatingInput';

const ReviewTitle = () => {
    const appTitle = useDefaultTitle();
    const { defaultTitle } = useCreateContext();
    return (
        <>
            <title>{`${appTitle} - ${defaultTitle}`}</title>
            <span>{defaultTitle}</span>
        </>
    );
};

const ReviewCreate = () => {
    const notify = useNotify();
    const redirect = useRedirect();
    const searchParams = useSearchParams();

    const onSuccess = (_: any) => {
        // Get product_id from search params if available
        const productId = searchParams.get('product_id');
        notify('resources.reviews.notifications.created');
        if (productId) {
            redirect(`/admin/products/${productId}/reviews`);
        } else {
            redirect(`/admin/reviews`);
        }
    };

    return (
        <Create mutationOptions={{ onSuccess }} title={<ReviewTitle />}>
            <SimpleForm
                defaultValues={{ status: 'pending' }}
                sx={{
                    maxWidth: '30em',
                }}
            >
                <ReferenceInput source="customer_id" reference="customers">
                    <AutocompleteInput validate={required()} />
                </ReferenceInput>
                <ReferenceInput source="product_id" reference="products">
                    <AutocompleteInput
                        optionText="reference"
                        validate={required()}
                    />
                </ReferenceInput>
                <DateInput
                    source="date"
                    defaultValue={new Date()}
                    validate={required()}
                />
                <StarRatingInput source="rating" defaultValue={2} />
                <TextInput
                    source="comment"
                    multiline
                    resettable
                    validate={required()}
                />
            </SimpleForm>
        </Create>
    );
};

export default ReviewCreate;
