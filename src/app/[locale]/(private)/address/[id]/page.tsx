import AddressForm from '@/components/templates/(private)/address/AddressForm';

type Props = {
  params: { id: string };
};

export default function AddressUpdatePage({ params }: Props) {
  return (
    <main className='max-w-3xl mx-auto p-4 pt-5'>
      <AddressForm />
    </main>
  );
}
