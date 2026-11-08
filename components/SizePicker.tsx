"use client";

import { useId, useState } from "react";
import { formatNPR } from "@/lib/format";
import type { Size } from "@/lib/types";
import { EnquiryDialog } from "./EnquiryDialog";
import type { EnquirySettings } from "./EnquiryForm";

type Props = EnquirySettings & {
  productName: string;
  sizes: Size[];
  pageUrl: string;
};

export function SizePicker({ productName, sizes, ...settings }: Props) {
  const id = useId();
  const [index, setIndex] = useState(0);
  const selected = sizes[index] as Size;
  const price = formatNPR(selected.price);

  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-sm font-medium">Size</label>
      <select id={id} value={index} onChange={(event) => setIndex(Number(event.target.value))} className="field">
        {sizes.map((size, i) => <option key={size.label} value={i}>{size.label}</option>)}
      </select>
      <p aria-live="polite" className="my-5 font-serif text-section">{price}</p>
      <EnquiryDialog
        {...settings}
        triggerLabel="Enquire About This Product"
        product={{ name: productName, size: selected.label, price }}
      />
    </div>
  );
}
