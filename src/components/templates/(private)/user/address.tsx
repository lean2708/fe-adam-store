import { deteleAddressById, getAllAddressUser } from "@/actions/addressActions"
import { AddressResponse } from "@/api-client"
import ConfirmDialogModule from "@/components/modules/ConfirmDialogModule"
import { Skeleton } from "@/components/ui/skeleton"
import { SquarePen, Trash } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { toast } from 'sonner'
export default function Address() {
  const [visible, setVisible] = useState(false)
  const [loading, setLoading] = useState(false)
  const [listAddress, setListAddress] = useState<AddressResponse[]>()
  const [selectAddressId, setSelectAddressId] = useState<number>()

  useEffect(() => { getAddress() }, [])
  const getAddress = async () => {
    try {
      const res = await getAllAddressUser()
      if (res.status == 200 && res.address?.items) {
        setListAddress(res.address.items)
      }
    } catch (error) { console.log(error) }
  }
  const handleDelete = async () => {
    try {
      setLoading(true)
      if (selectAddressId) {
        const res = await deteleAddressById(selectAddressId)
        if (res.status === 200) { await getAddress(); setVisible(false); toast.success('Xóa địa chỉ thành công') } else { toast.error('Lỗi khi xóa địa chỉ!') }
      }
    } catch (error) {
      toast.error('Lỗi khi xóa địa chỉ!')
    } finally {
      setLoading(false)
    }
  }
  if (!listAddress) return (
    <div className="mt-8 w-full h-90">
      <div className="flex w-full justify-between">
        <h5 className="font-bold text-3xl">Địa chỉ của tôi</h5>
        <Link href={'/address'} className="py-2 px-8 bg-black rounded-lg text-white">Thêm địa chỉ mới</Link>
      </div>
      <ul className="mt-5">
        <Skeleton className="w-full bg-gray-100 mt-3 py-9 px-6 flex items-center justify-between shadow" />
      </ul>
    </div>
  )
  if (listAddress.length === 0) return (
    <div className="mt-8 w-full h-90">
      <div className="flex w-full justify-between">
        <h5 className="font-bold text-3xl">Địa chỉ của tôi</h5>
        <Link href={'/address'} className="py-2 px-8 bg-black rounded-lg text-white">Thêm địa chỉ mới</Link>
      </div>
      <ul className="mt-5">
        <div className="w-full bg-gray-100 mt-3 py-9 px-6 flex items-center justify-center shadow">
          <p>Không có địa chỉ nào cả</p>
        </div>
      </ul>
    </div>
  )
  return (
    <div className="mt-8 w-full h-90">
      <div className="flex w-full justify-between">
        <h5 className="font-bold text-3xl">Địa chỉ của tôi</h5>
        <Link href={'/address'} className="py-2 px-8 bg-black rounded-lg text-white">Thêm địa chỉ mới</Link>
      </div>
      <ul className="mt-5">
        {listAddress && listAddress.map((address) => <li className="w-full bg-gray-100 mt-3 py-9 px-6 flex items-center justify-between shadow" key={address.id}>
          <div className="flex flex-col justify-between h-full relative">
            {address.isDefault && (
              <span className="border border-black text-xs text-center py-1 rounded-md w-20 absolute -top-7">Mặc định</span>
            )}
            <p className="mt-1">Địa chỉ: {address.streetDetail} - {address.ward?.name} - {address.district?.name} - {address.province?.name}</p>
            <p className="pt-2">Số điện thoại: {address.phone}</p>
          </div>
          <div className="flex">
            <Link className="mr-2 p-2" href={`/address/${address.id}`}>
              <SquarePen />
            </Link>
            <button className="p-2" onClick={() => {
              setSelectAddressId(address.id);
              setVisible(true);
            }}>
              <Trash color="red" />
            </button>
          </div>
        </li>)}
      </ul>
      <ConfirmDialogModule
        title="Bạn có chắc muốn xóa địa chỉ này?"
        onClose={() => { setVisible(false) }}
        confirm={visible}
        onSubmit={handleDelete}
        loading={loading} />
    </div>
  )
}