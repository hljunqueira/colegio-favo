import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

export const ConfirmModal = ({ open, onOpenChange, title, description, onConfirm, confirmText = "Confirmar", cancelText = "Cancelar" }) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="font-display text-lg font-bold text-ink">{title}</DialogTitle>
          {description && <p className="font-body text-sm text-ink-2 mt-2">{description}</p>}
        </DialogHeader>
        <DialogFooter className="flex justify-end gap-2 mt-4">
          <button 
            type="button" 
            onClick={() => onOpenChange(false)} 
            className="px-4 py-2 bg-cream-2 rounded-full font-body text-xs font-semibold text-ink-2 hover:bg-cream-3 transition-colors"
          >
            {cancelText}
          </button>
          <button 
            type="button" 
            onClick={() => {
              onConfirm();
              onOpenChange(false);
            }} 
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-cream rounded-full font-body text-xs font-semibold transition-colors"
          >
            {confirmText}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
