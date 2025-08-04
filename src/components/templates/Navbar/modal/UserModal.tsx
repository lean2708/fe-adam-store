import { User, ShoppingBag, LogIn, UserPlus } from "lucide-react"
import { Modal } from "@/components/ui/modal"
import { logoutAction } from "@/actions/nextAuthActions"
import { signOut, useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { useTranslations } from "next-intl"

export default function UserModal({ open, onClose }: { open: boolean, onClose: () => void }) {
  const { data: session, status, } = useSession()
  const router = useRouter()
  const t = useTranslations("Header")

  const isLogin = status === "authenticated" && !!session?.user
  const user = session?.user


  const handleLogout = async () => {
    try {
      // First call the API to invalidate the token on the server
      // This will also clear the httpOnly refresh token cookie
      await logoutAction()

      // Then sign out with NextAuth (this clears the client session)
      await signOut({
        redirect: false,
        callbackUrl: "/"
      })

      // Close the modal
      onClose()

      // Show success message
      toast.success(t("user.logout") + " thành công!")

      // Redirect to home page
      router.push("/")
    } catch (error) {
      console.error("Logout error:", error)
      toast.error("Có lỗi xảy ra khi " + t("user.logout").toLowerCase())

      // Even if there's an error, try to sign out with NextAuth
      try {
        await signOut({ redirect: false })
        onClose()
        router.push("/")
      } catch (signOutError) {
        console.error("NextAuth signOut error:", signOutError)
      }
    }
  }

  const handleNavigation = (path: string) => {
    onClose()
    router.push(path)
  }

  // If user is not logged in, show login/register options
  if (!isLogin) {
    return (
      <Modal
        open={open}
        onClose={onClose}
        variant="custom"
        showOverlay={true}
        style={{
          position: "absolute",
          width: "338px",
          minHeight: "160px",
          top: "40px",
          right: "25px",
          borderRadius: "8px",
          padding: "16px",
          zIndex: 9999,
          background: "#fff",
          boxShadow: "0 4px 24px rgba(0,0,0,0.12)",
          display: "flex",
          flexDirection: "column",
          maxHeight: "80vh",
          overflowY: "auto",
        }}
        className="border border-gray-200"
      >
        <div
          className="flex items-center h-16 rounded-2xl gap-3 hover:bg-gray-50 transition cursor-pointer"
          onClick={() => handleNavigation("/login")}
        >
          <div className="bg-gray-100 rounded-full p-3 flex items-center justify-center">
            <LogIn className="h-6 w-6 text-gray-400" />
          </div>
          <span className="text-lg font-medium">{t("user.login")}</span>
        </div>
        <div
          className="flex items-center h-16 rounded-2xl gap-3 hover:bg-gray-50 transition cursor-pointer"
          onClick={() => handleNavigation("/register")}
        >
          <div className="bg-gray-100 rounded-full p-3 flex items-center justify-center">
            <UserPlus className="h-6 w-6 text-gray-400" />
          </div>
          <span className="text-lg font-medium">{t("user.register")}</span>
        </div>
      </Modal>
    )
  }

  // If user is logged in, show user menu
  return (
    <Modal
      open={open}
      onClose={onClose}
      variant="custom"
      showOverlay={true}
      style={{
        position: "absolute",
        width: "338px",
        minHeight: "224px",
        top: "40px",
        right: "25px",
        borderRadius: "8px",
        padding: "16px",
        zIndex: 9999,
        background: "#fff",
        boxShadow: "0 4px 24px rgba(0,0,0,0.12)",
        display: "flex",
        flexDirection: "column",
        maxHeight: "80vh",
        overflowY: "auto",
      }}
      className="border border-gray-200"
    >
      {/* Welcome message for logged-in users */}
      {user?.name && (
        <div className="mb-2 p-3 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">Xin chào,</p>
          <p className="font-medium text-gray-900">{user.name}</p>
        </div>
      )}

      <div className=" px-3 py-1 flex items-center h-16 rounded-xl gap-3 hover:bg-gray-50 transition cursor-pointer">
        <div className="bg-gray-100 rounded-full p-3 flex items-center justify-center">
          <User className="h-6 w-6 text-gray-400" />
        </div>
        <span className="text-lg font-medium">{t("user.profile")}</span>
      </div>
      <div className="px-3 py-1  flex items-center h-16 rounded-2xl gap-3 hover:bg-gray-50 transition cursor-pointer">
        <div className="bg-gray-100 rounded-full p-3 flex items-center justify-center ">
          <ShoppingBag className="h-6 w-6 text-gray-400" />
        </div>
        <span className="text-lg font-medium">Đơn hàng của tôi</span>
      </div>
      <div
        className="px-3 py-1 flex items-center h-16 rounded-2xl gap-3 hover:bg-gray-50 transition cursor-pointer"
        onClick={handleLogout}
      >
        <div className="bg-gray-100 rounded-full p-3 flex items-center justify-center">
          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" className="h-6 w-6 text-gray-400" viewBox="0 0 24 24"><path d="M9 16l-4-4m0 0l4-4m-4 4h12"></path></svg>
        </div>
        <span className="text-lg font-medium">{t("user.logout")}</span>
      </div>
    </Modal>
  )
}
