"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";

interface AlertModalProps {
  title?: string;
  description?: string;
  isOpen: boolean;
  content?: React.ReactNode;
  confirmVariant?:
    | "link"
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost";

  cancelVariant?:
    | "link"
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost";

  onClose: () => void;
  onConfirm: () => void;
  loading: boolean;
}

export const AlertModal: React.FC<AlertModalProps> = ({
  title = "Você tem certeza disso?",
  description = "Esta ação não poderá ser desfeita",
  confirmVariant = "default",
  cancelVariant = "outline",
  isOpen,
  content,
  onClose,
  onConfirm,
  loading,
}) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <Modal
      title={title}
      description={description}
      isOpen={isOpen}
      onClose={onClose}
    >
      {content}
      <div className="pt-6 space-x-2 flex items-center justify-end w-full">
        <Button disabled={loading} variant={cancelVariant} onClick={onClose}>
          Cancelar
        </Button>
        <Button disabled={loading} variant={confirmVariant} onClick={onConfirm}>
          Confirmar
        </Button>
      </div>
    </Modal>
  );
};
