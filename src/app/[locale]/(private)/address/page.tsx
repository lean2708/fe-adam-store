import AddressForm from '@/components/templates/(private)/address/AddressForm';

type Props = {
  params: { id: string };
};

export default function NewAddressPage({ params }: Props) {
  return (
    <main className='w-full md:max-w-3xl mx-auto px-4 mt-5'>
      <AddressForm />
    </main>
  );
}
