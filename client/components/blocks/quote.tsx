import type { QuoteBlock } from "@/lib/types"

export default function Quote({ data }: { data: QuoteBlock }) {
  return (
    <blockquote className="border-l-4 border-blue-500 pl-4 my-8 italic">
      <p className="text-xl mb-2">{data.quote_text}</p>
      {data.author && <footer className="text-right font-medium">— {data.author}</footer>}
    </blockquote>
  )
}
