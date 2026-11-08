"use client";

import { useId, useRef, useState, type FormEvent, type ReactNode } from "react";
import { enquiryText, whatsappUrl, type EnquiryDetails } from "@/lib/whatsapp";

const ENDPOINT = "https://api.web3forms.com/submit";

export type EnquirySettings = {
  web3formsKey?: string;
  whatsappNumber?: string;
  email: string;
  businessName: string;
};

type Props = EnquirySettings & {
  pageUrl: string;
  product?: { name: string; size: string; price: string };
  interestGroups?: { label: string; options: string[] }[];
  onSuccess?: () => void;
};

type Errors = Partial<Record<"name" | "contact" | "email", string>>;
type Status = "idle" | "sending" | "success" | "error";

function Field({
  id,
  label,
  error,
  children,
  className = "",
}: {
  id: string;
  label: string;
  error?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1 block text-sm font-medium">{label}</label>
      {children}
      {error && <p id={`${id}-error`} className="mt-1 text-sm text-terracotta-ink">{error}</p>}
    </div>
  );
}

export function EnquiryForm({
  web3formsKey,
  whatsappNumber,
  email,
  businessName,
  pageUrl,
  product,
  interestGroups,
  onSuccess,
}: Props) {
  const id = useId();
  const form = useRef<HTMLFormElement>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Errors>({});
  const [mailto, setMailto] = useState("");

  const fid = (name: string) => `${id}-${name}`;
  const invalid = (name: string, key: keyof Errors = name as keyof Errors) =>
    errors[key] ? ({ "aria-invalid": true, "aria-describedby": `${fid(name)}-error` } as const) : {};

  function details(): EnquiryDetails {
    const data = new FormData(form.current as HTMLFormElement);
    const value = (name: string) => String(data.get(name) ?? "");
    return {
      product: product?.name,
      size: product?.size,
      price: product?.price,
      interest: value("interest"),
      pageUrl,
      name: value("name"),
      phone: value("phone"),
      email: value("email"),
      message: value("message"),
    };
  }

  function validate(d: EnquiryDetails): Errors {
    const next: Errors = {};
    if (!d.name?.trim()) next.name = "Please enter your name.";
    if (!d.email?.trim() && !d.phone?.trim()) next.contact = "Please give a phone number or an email address.";
    if (d.email?.trim() && !/^\S+@\S+\.\S+$/.test(d.email)) next.email = "Please check this email address.";
    return next;
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const element = event.currentTarget;
    if (new FormData(element).get("botcheck")) return;

    const current = details();
    const found = validate(current);
    setErrors(found);
    if (Object.keys(found).length) {
      element.querySelector<HTMLElement>(`#${CSS.escape(fid(found.name ? "name" : found.contact ? "phone" : "email"))}`)?.focus();
      return;
    }

    const subject = `Website enquiry: ${current.product ?? current.interest ?? "general"}`;
    setStatus("sending");
    setMailto(`mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(enquiryText(current))}`);

    try {
      if (!web3formsKey) throw new Error("Form key not configured");
      const response = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ access_key: web3formsKey, subject, from_name: businessName, ...current }),
      });
      const result = (await response.json()) as { success?: boolean };
      if (!response.ok || !result.success) throw new Error("Submission rejected");
      setStatus("success");
      element.reset();
      onSuccess?.();
    } catch {
      setStatus("error");
    }
  }

  function openWhatsApp() {
    if (whatsappNumber) window.open(whatsappUrl(whatsappNumber, details()), "_blank", "noopener");
  }

  return (
    <form ref={form} onSubmit={submit} noValidate className="grid grid-cols-2 gap-x-4 gap-y-4">
      <Field id={fid("name")} label="Your name" error={errors.name} className="col-span-2">
        <input id={fid("name")} name="name" autoComplete="name" required className="field" {...invalid("name")} />
      </Field>
      <Field id={fid("phone")} label="Phone" error={errors.contact} className="col-span-2 sm:col-span-1">
        <input id={fid("phone")} name="phone" type="tel" autoComplete="tel" className="field" {...invalid("phone", "contact")} />
      </Field>
      <Field id={fid("email")} label="Email" error={errors.email} className="col-span-2 sm:col-span-1">
        <input id={fid("email")} name="email" type="email" autoComplete="email" className="field" {...invalid("email")} />
      </Field>

      {product && (
        <>
          <Field id={fid("product")} label="Product" className="col-span-2">
            <input id={fid("product")} name="product" readOnly value={product.name} className="field" />
          </Field>
          <Field id={fid("size")} label="Size" className="col-span-1">
            <input id={fid("size")} name="size" readOnly value={product.size} className="field" />
          </Field>
          <Field id={fid("price")} label="Price" className="col-span-1">
            <input id={fid("price")} name="price" readOnly value={product.price} className="field" />
          </Field>
        </>
      )}

      {interestGroups && (
        <Field id={fid("interest")} label="Product or category of interest" className="col-span-2">
          <select id={fid("interest")} name="interest" className="field" defaultValue="General enquiry">
            <option>General enquiry</option>
            <option>Wholesale enquiry</option>
            {interestGroups.map((group) => (
              <optgroup key={group.label} label={group.label}>
                {group.options.map((option) => <option key={option}>{option}</option>)}
              </optgroup>
            ))}
          </select>
        </Field>
      )}

      <Field id={fid("message")} label="Message" className="col-span-2">
        <textarea id={fid("message")} name="message" rows={4} className="field" />
      </Field>

      {/* Honeypot: invisible to people, tempting to bots. */}
      <input type="checkbox" name="botcheck" tabIndex={-1} aria-hidden="true" className="hidden" />

      <div className="col-span-2 flex flex-wrap gap-3">
        <button type="submit" disabled={status === "sending"} className="btn btn-primary disabled:opacity-70">
          {status === "sending" ? "Sending…" : "Submit Enquiry"}
        </button>
        {whatsappNumber && (
          <button type="button" onClick={openWhatsApp} className="btn btn-ghost">
            Enquire via WhatsApp
          </button>
        )}
      </div>

      <div role="status" className="col-span-2 empty:hidden">
        {status === "success" && (
          <p className="border-l-2 border-forest pl-3 text-forest">Thank you. Your enquiry has been sent and we will reply soon.</p>
        )}
        {status === "error" && (
          <p className="border-l-2 border-terracotta pl-3">
            Sorry, your enquiry could not be sent from here.{" "}
            <a href={mailto} className="link-rule font-medium">Email it to {email} instead</a>
            , with your details already filled in.
          </p>
        )}
      </div>
    </form>
  );
}
