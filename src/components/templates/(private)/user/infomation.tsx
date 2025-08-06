import { changeAvatarAction } from "@/actions/fileActions";
import { getInfoUser, updateUserAction } from "@/actions/userActions";
import { UserResponse } from "@/api-client";
import { CircleUserRound, SquarePen } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { UserUpdateRequestGenderEnum as GenderEnum } from '@/api-client'

export default function Infomation() {
  const [infoUser, setInfoUser] = useState<UserResponse>();
  const inputRef = useRef<HTMLInputElement>(null)
  useEffect(() => {
    getUser();
  }, []);

  const getUser = async () => {
    try {
      const res = await getInfoUser();
      if (res.success && res.data) {
        setInfoUser(res.data);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (infoUser) {
      setInfoUser({ ...infoUser, [e.target.name]: e.target.value });
    }
  };
  const saveInfoUser = async () => {
    try {
      if (infoUser?.id && infoUser.name && infoUser.gender && infoUser.roles) {
        const newInfo = {
          name: infoUser.name,
          dob: infoUser.dob,
          gender: String(infoUser.gender) || "OTHER",
          roleIds: [1,2]
        }
        console.log(newInfo)
        const res = await updateUserAction(infoUser.id, newInfo);
        if (res) console.log(res);
      }

    } catch (error) {
      console.error("Error saving user info:", error);
    }
  }
  const uploadAvatar = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    console.log(file)
    try {
      if (file) {
        const res = await changeAvatarAction(file)
        if (res.success && res.data) {
          setInfoUser(res.data);
        }
      }
    } catch (error) {
      console.log(error);
    }
  }
  if (!infoUser) return <div>Loading...</div>;

  return (
    <div className="mt-8 w-full px-10 pb-8 border-2 border-black rounded-lg shadow">
      <div className="w-full flex justify-center pt-10">
        <div className="h-37 relative w-37 rounded-full overflow-hidden group">
          {infoUser.avatarUrl ? (
            <>
              <img className="w-full h-full object-cover" src={infoUser.avatarUrl} alt={infoUser.name} />
              <button onClick={() => inputRef.current?.click()} className="bg-gradient-to-t from-[rgba(255, 255, 255, 0.19)] to-[rgba(251, 251, 251, 0)] flex justify-center items-center w-full px-2 pb-10 py-1 text-sm text-black absolute -bottom-7 left-0 bg-gray-200 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:bottom-2 duration-500">
                <SquarePen size={18} className="mr-1" />
                Thay đổi avatar
              </button>
            </>
          ) : (
            <CircleUserRound className="h-34 w-34 rounded-full" />
          )}
        </div>

      </div>
      <div className="pt-6">
        <p className="w-full flex justify-between h-9">
          <span style={{ width: '30%' }}>Họ tên:</span>
          <input
            className="border-b-1 border-gray-300 w-120 pl-0 outline-none"
            style={{ width: '70%' }}
            type="text"
            name="name"
            value={infoUser.name}
            onChange={handleInputChange}
          />
        </p>
        <div className="w-full flex mt-4 h-9">
          <span style={{ width: '30%' }}>Giới tính:</span>
          <p onClick={() => setInfoUser({ ...infoUser, gender: GenderEnum.Male })}>
            <input className="mr-1"
              type="radio"
              name="gender"
              checked={infoUser.gender === 'MALE'}

            />
            <label>Nam</label>
          </p>
          <p onClick={() => setInfoUser({ ...infoUser, gender: GenderEnum.Female })}
            className="mx-3">
            <input className="mr-1"
              type="radio"
              name="gender"
              checked={infoUser.gender === 'FEMALE'}
            />
            <label>Nữ</label>
          </p>
          <p onClick={() => setInfoUser({ ...infoUser, gender: GenderEnum.Other })}>
            <input className="mr-1"
              type="radio"
              name="gender"
              checked={infoUser.gender === 'OTHER' || infoUser.gender == null}
            />
            <label>Khác</label>
          </p>
        </div>
        <p className="mt-4 w-full flex justify-between h-9">
          <span style={{ width: '30%' }}>Ngày sinh:</span>
          <input
            type="date"
            className="border-b-1 border-gray-300 w-120 pl-0 outline-none"
            style={{ width: '70%' }}
            name="dob"
            value={infoUser.dob}
            onChange={handleInputChange}
          />
        </p>
        <p className="mt-4 w-full flex justify-between h-9">
          <span style={{ width: '30%' }}>Email:</span>
          <input
            className="border-b-1 border-gray-300 w-120 pl-0 outline-none"
            style={{ width: '70%' }}
            type="text"
            name="email"
            value={infoUser.email}
            onChange={handleInputChange}
          />
        </p>
      </div>
      <div className="mt-6 w-full text-center">
        <button className="text-white py-2 px-5 bg-black rounded-lg" onClick={saveInfoUser}>Lưu thay đổi</button>
      </div>
      <input ref={inputRef}
        type="file"
        onChange={uploadAvatar}
        style={{ display: 'none' }}
        hidden />
    </div>
  );
}