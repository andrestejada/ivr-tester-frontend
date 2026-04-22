"use client"

import * as React from "react"
import { Dialog as DialogPrimitive } from "radix-ui"

import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { cn } from "@/lib/utils"

interface ConfirmationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description: string
  onConfirm: () => void | Promise<void>
  isLoading?: boolean
  errorMessage?: string
  confirmLabel?: string
  cancelLabel?: string
}

function ConfirmationDialog({
  open,
  onOpenChange,
  title,
  description,
  onConfirm,
  isLoading = false,
  errorMessage,
  confirmLabel = "Eliminar",
  cancelLabel = "Cancelar",
}: ConfirmationDialogProps) {
  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay
          className={cn(
            "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50"
          )}
        />
        <DialogPrimitive.Content
          className={cn(
            "bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed top-[50%] left-[50%] z-50 w-[min(92vw,32rem)] -translate-x-1/2 -translate-y-1/2 rounded-lg border p-6 shadow-lg"
          )}
        >
          <DialogPrimitive.Title className="text-lg font-semibold text-foreground">
            {title}
          </DialogPrimitive.Title>
          <DialogPrimitive.Description className="mt-2 text-sm text-muted-foreground">
            {description}
          </DialogPrimitive.Description>

          {errorMessage ? (
            <p className="mt-3 text-sm font-medium text-destructive">{errorMessage}</p>
          ) : null}

          <div className="mt-6 flex items-center justify-end gap-2">
            <DialogPrimitive.Close asChild>
              <Button type="button" variant="outline" disabled={isLoading}>
                {cancelLabel}
              </Button>
            </DialogPrimitive.Close>
            <Button type="button" variant="destructive" onClick={onConfirm} disabled={isLoading}>
              {isLoading ? (
                <>
                  <Spinner className="mr-2 h-4 w-4" />
                  Eliminando...
                </>
              ) : (
                confirmLabel
              )}
            </Button>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}

export { ConfirmationDialog }
