"use server";

import {
  createProductApi,
  updateProductApi,
  deleteProductApi,
  fetchAllProductsApi,
} from "@/lib/data/product";
import {
  productCreateSchema,
  productUpdateSchema,
} from "@/actions/schema/productSchema";

// --- Actions ---
export async function addProductAction(formData: FormData) {
  // Parse details from formData
  const detailsRaw = formData.get("details");
  if (!detailsRaw) {
    return {
      status: 400,
      message: "Missing product details",
    };
  }

  let details: any;
  try {
    details = JSON.parse(JSON.parse(JSON.stringify(detailsRaw)));
  } catch {
    return {
      status: 400,
      message: "Invalid product details format",
    };
  }

  // Validate using productCreateSchema
  const validated = productCreateSchema.safeParse(details);
  if (!validated.success) {
    return {
      status: 403,
      message: "data invalid",
      errors: validated.error.flatten().fieldErrors,
    };
  }

  // Handle images (mainImage and images)
  const mainImage = formData.get("mainImage") as File;
  let images: File[] = [];
  for (let i = 0; i < 5; i++) {
    const img = formData.get(`image-${i}`) as File;
    if (img) images.push(img);
  }

  if (!mainImage || images.length < 1) {
    return {
      status: 403,
      message: "images invalid",
    };
  }

  // NOTE: You must implement or import an image upload API for mainImage/images.
  // Here we just pass the image file names as placeholders.
  // Replace this with your actual upload logic.
  const uploadImageRes = {
    paths: {
      mainImage: typeof mainImage === "object" && "name" in mainImage ? mainImage.name : "",
      images: images.map(img => (typeof img === "object" && "name" in img ? img.name : "")),
    }
  };

  if (!uploadImageRes)
    return { status: 500, message: "upload image failed" };

  try {
    // Create Product via API
    const productPayload = {
      ...validated.data,
      mainImage: uploadImageRes.paths.mainImage,
      images: uploadImageRes.paths.images,
      sales: 0,
      categoryId: validated.data.categoryId,
    };
    const created = await createProductApi(productPayload);

    return {
      product: created,
      status: 201,
      message: "product created successfully",
    };
  } catch (error) {
    return {
      status: 500,
      message: "error in create product",
      error,
    };
  }
}

export async function getAllProductsAction() {
  try {
    const products = await fetchAllProductsApi();
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

export async function deleteProductAction(id: string) {
  try {
    const deleted = await deleteProductApi(Number(id));
    const allProducts = await fetchAllProductsApi();
    return {
      allProducts,
      status: 202,
      message: "Product deleted",
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
  const dataRaw = formData.get("data");
  if (!dataRaw) {
    return {
      status: 400,
      message: "Missing product data",
    };
  }

  let details: any;
  try {
    details = JSON.parse(JSON.parse(JSON.stringify(dataRaw)));
  } catch {
    return {
      status: 400,
      message: "Invalid product data format",
    };
  }

  // Validate using productUpdateSchema
  const validated = productUpdateSchema.safeParse(details);
  if (!validated.success) {
    return {
      status: 403,
      message: "data invalid",
      errors: validated.error.flatten().fieldErrors,
    };
  }

  if (!details.id) {
    return {
      status: 400,
      message: "Missing product id",
    };
  }

  try {
    const updated = await updateProductApi(Number(details.id), validated.data);
    const allProducts = await fetchAllProductsApi();
    return {
      allProducts,
      status: 200,
      message: "Product updated",
      updated,
    };
  } catch (error) {
    return {
      status: 500,
      error,
    };
  }
}

