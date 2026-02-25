import * as React from "react"
import { Dialog as HeadlessDialog, Transition, TransitionChild } from "@headlessui/react"
import { Fragment } from "react"

export interface DialogsProps {
  open: boolean
  onClose: () => void
  title?: React.ReactNode
  children: React.ReactNode
  confirmText?: string
  cancelText?: string
  onConfirm?: () => void
  loading?: boolean
}

export function Dialogs({
  open,
  onClose,
  title,
  children,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  loading = false,
}: DialogsProps) {
  return (
    <Transition appear show={open} as={Fragment}>
      <HeadlessDialog as="div" className="relative z-50" onClose={onClose}>
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/20" />
        </TransitionChild>
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <TransitionChild
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <HeadlessDialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                {title && (
                  <HeadlessDialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    {title}
                  </HeadlessDialog.Title>
                )}
                <div className="mt-2">{children}</div>
                <div className="mt-4 flex justify-end gap-2">
                  <button
                    type="button"
                    className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none"
                    onClick={onClose}
                    disabled={loading}
                  >
                    {cancelText}
                  </button>
                  {onConfirm && (
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none"
                      onClick={onConfirm}
                      disabled={loading}
                    >
                      {loading ? "Processing..." : confirmText}
                    </button>
                  )}
                </div>
              </HeadlessDialog.Panel>
            </TransitionChild>
          </div>
        </div>
      </HeadlessDialog>
    </Transition>
  )
}
