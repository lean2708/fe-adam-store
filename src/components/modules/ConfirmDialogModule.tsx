import { cn } from "@/lib/utils";
import { Card } from "../ui/card";

export default function ConfirmDialogModule(props: { loading: boolean, onClose: () => void, title: string, confirm: boolean, onSubmit: () => void }) {
  const { loading, onClose, onSubmit, confirm, title } = props

  if (!confirm) return null;
  const stopPropagation = (e: React.MouseEvent) => e.stopPropagation();
  return (
    <div
      className={cn("fixed inset-0 z-50 flex items-center justify-center bg-black/40")}
      onClick={loading ? undefined : () => onClose()}
    >
      <Card
        className={cn("relative w-fullmax-w-xs bg-white dark:bg-neutral-950 rounded-xl shadow-lg", loading && "cursor-wait")}
        onClick={stopPropagation}
      >
        <div className="bg-white rounded-lg p-6 shadow-lg w-full max-w-sm text-center">
          <p className="text-lg font-semibold mb-4">
            {title}
          </p>
          <div className="flex justify-center gap-4 mt-4">
            <button
              className={cn("w-2/4 py-1.5 border border-black text-black rounded-md", loading && "cursor-wait")}
              onClick={onClose}
            >
              Hủy
            </button>
            <button
              className={cn("w-2/4 py-1.5 bg-black text-white rounded-md", loading && "cursor-wait")}
              onClick={onSubmit}
            >
              Xác nhận
            </button>
          </div>
        </div>
      </Card>

    </div>
  )
}