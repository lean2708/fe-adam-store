import { changePasswordAction } from "@/actions/userActions"
import { Eye, EyeOff } from "lucide-react"
import { useState } from "react"

export default function ChangePassword() {
  const [newPass, setNewPass] = useState(
    {
      oldPassword: '',
      newPassword: '',
      confirmPassword: ''
    }
  )
  const [eye, setEye] = useState(
    {
      oldPassword: false,
      newPassword: false,
      confirmPassword: false
    }
  )
  const submitChangePassword = async () => {
    try {
      console.log(newPass)
      const res = await changePasswordAction(newPass)
      if (res) { console.log(res) }
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <div className="mt-8 w-full h-90 border-2 border-black rounded-lg shadow">
      <ul className="w-full px-15">
        <li className="w-full flex justify-between mt-8 items-center h-13 relative">
          <p className="font-semibold">Mật khẩu hiện tại:</p>
          <input onChange={(e) => setNewPass({ ...newPass, oldPassword: e.target.value })} className="border border-gray-400 pl-3 rounded-lg w-130 h-full font-semibold outline-none" type={eye.oldPassword ? 'text' : 'password'} placeholder="Mật khẩu hiện tại" />
          <button className="px-2 py-2 absolute right-0 outline-none" onClick={() => setEye({ ...eye, oldPassword: !eye.oldPassword })}>{eye.oldPassword ? <Eye /> : <EyeOff />}</button> </li>
        <li className="w-full flex justify-between mt-8 items-center h-13 relative">
          <p className="font-semibold">
            Mật khẩu mới:
          </p>
          <input onChange={(e) => setNewPass({ ...newPass, newPassword: e.target.value })} className="border border-gray-400 pl-3 rounded-lg w-130 h-full font-semibold outline-none" type={eye.newPassword ? 'text' : 'password'} placeholder="Nhập mật khẩu mới" />
          <button className="px-2 py-2 absolute right-0 outline-none" onClick={() => setEye({ ...eye, newPassword: !eye.newPassword })}>{eye.newPassword ? <Eye /> : <EyeOff />}</button></li>
        <li className="w-full flex justify-between mt-8 items-center h-13 relative">
          <p className="font-semibold">
            Xác nhận mật khẩu mới:
          </p>
          <input onChange={(e) => setNewPass({ ...newPass, confirmPassword: e.target.value })} className="border border-gray-400 pl-3 rounded-lg w-130 h-full font-semibold outline-none" type={eye.confirmPassword ? 'text' : 'password'} placeholder="Xác nhận mật khẩu mới" />
          <button className="px-2 py-2 absolute right-0 outline-none" onClick={() => setEye({ ...eye, confirmPassword: !eye.confirmPassword })}>{eye.confirmPassword ? <Eye /> : <EyeOff />}</button> </li>
      </ul>
      <div className="w-full text-center mt-7">
        <button className="px-9 py-3 bg-black text-white rounded-lg" onClick={submitChangePassword}>Lưu thay đổi</button>
      </div>
    </div>
  )
}