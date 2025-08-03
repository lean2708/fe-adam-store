import { Card } from "../ui/card";

export default function ConfirmDialogModule(props: { onClose: () => void, confirm: boolean, onSubmit: () => void }) {
  const { onClose, onSubmit, confirm } = props

  if (!confirm) return null;
  const stopPropagation = (e: React.MouseEvent) => e.stopPropagation();
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={onClose}
    >
      <Card
        className="relative w-fullmax-w-xs bg-white dark:bg-neutral-950 rounded-xl shadow-lg"
        onClick={stopPropagation}
      >
        <div className="bg-white rounded-lg p-6 shadow-lg w-full max-w-sm text-center">
          <p className="text-lg font-semibold mb-4">
            Bạn có chắc muốn chọn địa chỉ này?
          </p>
          <div className="flex justify-center gap-4 mt-4">
            <button
              className="w-2/4 py-1.5 border border-black text-black rounded-md"
              onClick={onClose}
            >
              Hủy
            </button>
            <button
              className="w-2/4 py-1.5 bg-black text-white rounded-md"
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