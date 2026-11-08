"use client";

import { useId, useRef, useState, type MouseEvent } from "react";
import { EnquiryForm, type EnquirySettings } from "./EnquiryForm";

type Props = EnquirySettings & {
  pageUrl: string;
  product: { name: string; size: string; price: string };
  triggerLabel: string;
};

export function EnquiryDialog({ triggerLabel, ...formProps }: Props) {
  const dialog = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const sent = useRef(false);
  const [formKey, setFormKey] = useState(0);

  function open() {
    dialog.current?.showModal();
    dialog.current?.querySelector<HTMLElement>("input:not([readonly]):not([type=checkbox])")?.focus();
  }

  function close() {
    dialog.current?.close();
  }

  // Clicking the backdrop lands on the <dialog> element itself.
  function onDialogClick(event: MouseEvent<HTMLDialogElement>) {
    if (event.target === dialog.current) close();
  }

  // A sent form starts fresh next time. An unsent one keeps what was typed.
  function onClose() {
    if (sent.current) {
      sent.current = false;
      setFormKey((key) => key + 1);
    }
  }

  return (
    <>
      <button type="button" onClick={open} className="btn btn-primary w-full">
        {triggerLabel}
      </button>
      <dialog
        ref={dialog}
        aria-labelledby={titleId}
        onClick={onDialogClick}
        onClose={onClose}
        className="m-auto max-h-[92svh] w-[min(40rem,calc(100vw-1.5rem))] overflow-y-auto bg-ivory text-ink"
      >
        <div className="p-5 sm:p-8">
          <div className="mb-5 flex items-start justify-between gap-4">
            <h2 id={titleId} className="text-sub">Enquire about {formProps.product.name}</h2>
            <button type="button" onClick={close} className="min-h-11 shrink-0 px-2 text-sm font-medium underline underline-offset-4">
              Close
            </button>
          </div>
          <EnquiryForm key={formKey} {...formProps} onSuccess={() => (sent.current = true)} />
        </div>
      </dialog>
    </>
  );
}
