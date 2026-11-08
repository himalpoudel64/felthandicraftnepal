import type { ReactNode } from "react";
import type { PortableBlock, PortableSpan } from "@/lib/types";

function renderSpan(span: PortableSpan, index: number): ReactNode {
  return (span.marks ?? []).reduce<ReactNode>((node, mark) => {
    if (mark === "strong") return <strong className="font-medium">{node}</strong>;
    if (mark === "em") return <em>{node}</em>;
    return node;
  }, <span key={span._key ?? index}>{span.text}</span>);
}

const children = (block: PortableBlock) => block.children.map(renderSpan);

/** Renders the small set of styles the Studio allows: paragraphs, one heading, lists. */
export function PortableText({ value, className = "" }: { value: PortableBlock[] | undefined; className?: string }) {
  if (!value?.length) return null;
  const output: ReactNode[] = [];

  for (let i = 0; i < value.length; i++) {
    const block = value[i] as PortableBlock;
    if (block.listItem) {
      const items: PortableBlock[] = [];
      const kind = block.listItem;
      while (value[i]?.listItem === kind) items.push(value[i++] as PortableBlock);
      i--;
      const list = items.map((item, n) => <li key={item._key ?? n}>{children(item)}</li>);
      output.push(kind === "number" ? <ol key={i}>{list}</ol> : <ul key={i}>{list}</ul>);
    } else if (block.style === "h3") {
      output.push(<h3 key={block._key ?? i}>{children(block)}</h3>);
    } else {
      output.push(<p key={block._key ?? i}>{children(block)}</p>);
    }
  }

  return <div className={`prose-cms ${className}`}>{output}</div>;
}
