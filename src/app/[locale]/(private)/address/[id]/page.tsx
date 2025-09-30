import dynamic from 'next/dynamic';

const AddressForm = dynamic(
  () => import('@/components/templates/(private)/address/AddressForm'),
  {
    loading: () => <p>Đang tải biểu mẫu địa chỉ...</p>, // Optional: hiển thị khi đang load
  }
);

type Props = {
  params: { id: string };
};

export default function AddressUpdatePage({ params }: Props) {
  return (
    <main className='w-full md:max-w-3xl mx-auto px-4 mt-5'>
      <AddressForm />
    </main>
  );
}
