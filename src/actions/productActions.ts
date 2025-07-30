'use server';

import {
  createProductApi,
  updateProductApi,
  deleteProductApi,
  fetchAllProductsApi,
  searchProductApi,
  fetchProductDetailsApi,
  fetchProductReviewssApi,
} from '@/lib/data/product';
import {
  productCreateSchema,
  productUpdateSchema,
} from '@/actions/schema/productSchema';

export async function getAllProductsAction(
  page?: number,
  size?: number,
  sort?: string[]
) {
  try {
    const products = await fetchAllProductsApi(page, size, sort);
    return {
      status: 200,
      products,
    };
  } catch (error) {
    return {
      status: 500,
      error,
    };
  }
}

export async function getProductDetailsAction(id: string) {
  try {
    const product = await fetchProductDetailsApi(Number(id));

    if (!product) {
      return {
        status: 404,
        message: 'Product not found',
      };
    }

    return {
      status: 200,
      product,
    };
  } catch (error) {
    return {
      status: 500,
      error,
    };
  }
}

export async function getProductReviewsAction(
  id: string,
  page?: number,
  size?: number,
  sort?: string[]
) {
  try {
    const reviews = await fetchProductReviewssApi(Number(id), page, size, sort);

    if (!reviews) {
      return {
        status: 404,
        message: 'Reviews not found',
      };
    }

    return {
      status: 200,
      reviews,
    };
  } catch (error) {
    return {
      status: 500,
      error,
    };
  }
}

export async function deleteProductAction(id: string) {
  try {
    const deleted = await deleteProductApi(Number(id));
    const allProducts = await fetchAllProductsApi();
    return {
      allProducts,
      status: 202,
      message: 'Product deleted',
      deleted,
    };
  } catch (error) {
    return {
      status: 500,
      error,
    };
  }
}

export async function updateProductAction(formData: FormData) {
  // Parse details from formData
  const dataRaw = formData.get('data');
  if (!dataRaw) {
    return {
      status: 400,
      message: 'Missing product data',
    };
  }

  let details: any;
  try {
    details = JSON.parse(JSON.parse(JSON.stringify(dataRaw)));
  } catch {
    return {
      status: 400,
      message: 'Invalid product data format',
    };
  }

  // Validate using productUpdateSchema
  const validated = productUpdateSchema.safeParse(details);
  if (!validated.success) {
    return {
      status: 403,
      message: 'data invalid',
      errors: validated.error.flatten().fieldErrors,
    };
  }

  if (!details.id) {
    return {
      status: 400,
      message: 'Missing product id',
    };
  }

  try {
    const updated = await updateProductApi(Number(details.id), validated.data);
    const allProducts = await fetchAllProductsApi();
    return {
      allProducts,
      status: 200,
      message: 'Product updated',
      updated,
    };
  } catch (error) {
    return {
      status: 500,
      error,
    };
  }
}

export async function searchProductsAction(
  page?: number,
  size?: number,
  sort?: string[],
  search?: string[]
) {
  try {
    const products = await searchProductApi(page, size, sort, search);
    return {
      status: 200,
      products,
    };
  } catch (error) {
    return {
      status: 500,
      error,
    };
  }
}
