
import { ContentUser } from "@/components/templates/(private)/user/ContentUser";


export default function UserPage() {
  return (
    <main className="flex justify-center pb-10 items-start pt-10 mt-4 px-4" style={{ minHeight: '68vh' }}>
      <div className="w-full max-w-7xl flex gap-10">
        <ContentUser />
      </div>
    </main>
  )
}
