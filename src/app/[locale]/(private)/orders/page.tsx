import '@/app/globals.css';
import { ContentOrder } from '@/components/templates/(private)/orders/ContentOrder';

export default function OrderPage() {
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [itemOnModule, setItemOnModule] = useState<TOrder>();
  const [activeStatus, setActiveStatus] = useState<TabStatus>('PENDING');
  const [listOrders, setListOrders] = useState<TOrder[]>([]);

  const router = useRouter();

  useEffect(() => {
    getData();
  }, [activeStatus]);

  const getData = async () => {
    try {
      setIsLoading(true);
      const res = await getAllOrderUserAction(activeStatus);
      console.log(res);
      if (res.status === 200 && res.orders) {
        setListOrders(res.orders as TOrder[]);
      }
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetryPayment = async (orderId: number) => {
    try {
      const res = await retryPaymentviaVnPayAction(orderId);

      if (res.success && res.data?.paymentUrl) {
        router.push(res.data.paymentUrl);
      } else {
        toast.error('Không thể tạo liên kết thanh toán. Vui lòng thử lại.');
      }
    } catch (error) {
      console.error('Failed to retry payment:', error);
      toast.error('Có lỗi xảy ra khi tạo liên kết thanh toán.');
    }
  };

  return (
    <main className='max-w-7xl mx-auto p-4'>
      <h1 className='text-2xl font-bold mb-4'>Đơn hàng của tôi</h1>
      <ContentOrder />
    </main>
  );
}
