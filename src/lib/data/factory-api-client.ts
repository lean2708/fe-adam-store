import {
  StatisticsControllerApi,
  UserControllerApi,
  ProductControllerApi,
  ProductVariantControllerApi,
  OrderControllerApi,
  FileControllerApi,
  RoleControllerApi,
  BranchControllerApi,
  CartControllerApi,
  CartItemControllerApi,
  CategoryControllerApi,
  ChatMessageControllerApi,
  ConversationControllerApi,
  SizeControllerApi,
  ColorControllerApi,
  PromotionControllerApi,
  PaymentHistoryControllerApi,
  ProvinceControllerApi,
  DistrictControllerApi,
  AddressControllerApi,
  AuthControllerApi,
  ReviewControllerApi
} from "@/api-client";
import { getAuthenticatedAxiosInstance } from "@/lib/auth/axios-config";
import { AxiosInstance } from "axios";

/**
 * Controller factory for creating authenticated API controller instances
 */
export class ControllerFactory {
  private static axiosInstance: AxiosInstance | null = null;

  /**
   * Initialize the factory with authenticated axios instance
   */
  private static async getAxiosInstance() {
    this.axiosInstance = await getAuthenticatedAxiosInstance();
    return this.axiosInstance;
  }

  /**
   * Get Statistics Controller
   */
  static async getStatisticsController(): Promise<StatisticsControllerApi> {
    const axiosInstance = await this.getAxiosInstance();
    return new StatisticsControllerApi(undefined, undefined, axiosInstance);
  }
  static async getAddressController(): Promise<AddressControllerApi> {
    const axiosInstance = await this.getAxiosInstance();
    return new AddressControllerApi(undefined, undefined, axiosInstance);
  }
  static async getProvinceController(): Promise<ProvinceControllerApi> {
    const axiosInstance = await this.getAxiosInstance();
    return new ProvinceControllerApi(undefined, undefined, axiosInstance);
  }
  static async getDistrictController(): Promise<DistrictControllerApi> {
    const axiosInstance = await this.getAxiosInstance();
    return new DistrictControllerApi(undefined, undefined, axiosInstance);
  }
  /**
   * Get User Controller
   */
  static async getUserController(): Promise<UserControllerApi> {
    const axiosInstance = await this.getAxiosInstance();
    return new UserControllerApi(undefined, undefined, axiosInstance);
  }
  static async getAuthController(): Promise<AuthControllerApi> {
    const axiosInstance = await this.getAxiosInstance();
    return new AuthControllerApi(undefined, undefined, axiosInstance);
  }
  /**
   * Get Product Controller
   */
  static async getProductController(): Promise<ProductControllerApi> {
    const axiosInstance = await this.getAxiosInstance();
    return new ProductControllerApi(undefined, undefined, axiosInstance);
  }

  /**
   * Get ProductVariant Controller
   */
  static async getProductVariantController(): Promise<ProductVariantControllerApi> {
    const axiosInstance = await this.getAxiosInstance();
    return new ProductVariantControllerApi(undefined, undefined, axiosInstance);
  }

  /**
   * Get Order Controller
   */
  static async getOrderController(): Promise<OrderControllerApi> {
    const axiosInstance = await this.getAxiosInstance();
    return new OrderControllerApi(undefined, undefined, axiosInstance);
  }
  static async getReviewController(): Promise<ReviewControllerApi> {
    const axiosInstance = await this.getAxiosInstance();
    return new ReviewControllerApi(undefined, undefined, axiosInstance);
  }
  /**
   * Get File Controller
   */
  static async getFileController(): Promise<FileControllerApi> {
    const axiosInstance = await this.getAxiosInstance();
    return new FileControllerApi(undefined, undefined, axiosInstance);
  }

  /**
   * Get Role Controller
   */
  static async getRoleController(): Promise<RoleControllerApi> {
    const axiosInstance = await this.getAxiosInstance();
    return new RoleControllerApi(undefined, undefined, axiosInstance);
  }

  /**
   * Get Branch Controller
   */
  static async getBranchController(): Promise<BranchControllerApi> {
    const axiosInstance = await this.getAxiosInstance();
    return new BranchControllerApi(undefined, undefined, axiosInstance);
  }

  /**
   * Get Cart Controller
   */
  static async getCartController(): Promise<CartControllerApi> {
    const axiosInstance = await this.getAxiosInstance();
    return new CartControllerApi(undefined, undefined, axiosInstance);
  }

  /**
   * Get CartItem Controller
   */
  static async getCartItemController(): Promise<CartItemControllerApi> {
    const axiosInstance = await this.getAxiosInstance();
    return new CartItemControllerApi(undefined, undefined, axiosInstance);
  }

  /**
   * Get Category Controller
   */
  static async getCategoryController(): Promise<CategoryControllerApi> {
    const axiosInstance = await this.getAxiosInstance();
    return new CategoryControllerApi(undefined, undefined, axiosInstance);
  }

  /**
   * Get ChatMessage Controller
   */
  static async getChatMessageController(): Promise<ChatMessageControllerApi> {
    const axiosInstance = await this.getAxiosInstance();
    return new ChatMessageControllerApi(undefined, undefined, axiosInstance);
  }

  /**
   * Get Conversation Controller
   */
  static async getConversationController(): Promise<ConversationControllerApi> {
    const axiosInstance = await this.getAxiosInstance();
    return new ConversationControllerApi(undefined, undefined, axiosInstance);
  }

  /**
   * Get Size Controller
   */
  static async getSizeController(): Promise<SizeControllerApi> {
    const axiosInstance = await this.getAxiosInstance();
    return new SizeControllerApi(undefined, undefined, axiosInstance);
  }

  /**
   * Get Color Controller
   */
  static async getColorController(): Promise<ColorControllerApi> {
    const axiosInstance = await this.getAxiosInstance();
    return new ColorControllerApi(undefined, undefined, axiosInstance);
  }

  /**
   * Get Promotion Controller
   */
  static async getPromotionController(): Promise<PromotionControllerApi> {
    const axiosInstance = await this.getAxiosInstance();
    return new PromotionControllerApi(undefined, undefined, axiosInstance);
  }

  /**
   * Get PaymentHistory Controller
   */
  static async getPaymentHistoryController(): Promise<PaymentHistoryControllerApi> {
    const axiosInstance = await this.getAxiosInstance();
    return new PaymentHistoryControllerApi(undefined, undefined, axiosInstance);
  }

  /**
   * Reset axios instance (useful for testing or when auth changes)
   */
  static resetAxiosInstance() {
    this.axiosInstance = null;
  }
}

// Legacy support - keeping the old interface for backward compatibility
export interface ApiClient {
  statisticsControllerApi: StatisticsControllerApi;
  userControllerApi: UserControllerApi;
  productControllerApi: ProductControllerApi;
  orderControllerApi: OrderControllerApi;
  fileControllerApi: FileControllerApi;
  roleControllerApi: RoleControllerApi;
  branchControllerApi: BranchControllerApi;
  cartControllerApi: CartControllerApi;
  cartItemControllerApi: CartItemControllerApi;
  categoryControllerApi: CategoryControllerApi;
  chatMessageControllerApi: ChatMessageControllerApi;
  conversationControllerApi: ConversationControllerApi;
  sizeControllerApi: SizeControllerApi;
  colorControllerApi: ColorControllerApi;
  promotionControllerApi: PromotionControllerApi;
}

/**
 * Get authenticated API client with all controllers using factory pattern
 */
export async function getAuthenticatedApiClient(): Promise<ApiClient> {
  return {
    statisticsControllerApi: await ControllerFactory.getStatisticsController(),
    userControllerApi: await ControllerFactory.getUserController(),
    productControllerApi: await ControllerFactory.getProductController(),
    orderControllerApi: await ControllerFactory.getOrderController(),
    fileControllerApi: await ControllerFactory.getFileController(),
    roleControllerApi: await ControllerFactory.getRoleController(),
    branchControllerApi: await ControllerFactory.getBranchController(),
    cartControllerApi: await ControllerFactory.getCartController(),
    cartItemControllerApi: await ControllerFactory.getCartItemController(),
    categoryControllerApi: await ControllerFactory.getCategoryController(),
    chatMessageControllerApi: await ControllerFactory.getChatMessageController(),
    conversationControllerApi: await ControllerFactory.getConversationController(),
    sizeControllerApi: await ControllerFactory.getSizeController(),
    colorControllerApi: await ControllerFactory.getColorController(),
    promotionControllerApi: await ControllerFactory.getPromotionController(),
  };
}
