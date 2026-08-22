/** Renders a plain string that may contain ```-fenced code spans, treating them as code blocks and the rest as prose. Shared by TechnicalRoundQuestions and QuestionBankClient since interview questions/answers are plain TS strings, not MDX. */
export function FencedText({ text, className }: { text: string; className?: string }) {
  const parts = text.split(/```(?:[a-z]*\n)?/g);
  return (
    <div className={className}>
      {parts.map((part, i) =>
        i % 2 === 1 ? (
          <pre key={i} className="my-2 overflow-x-auto rounded-md bg-zinc-900 p-3 text-xs text-zinc-100">
            <code>{part.trim()}</code>
          </pre>
        ) : (
          part
            .split(/\n{2,}/)
            .filter((p) => p.trim())
            .map((para, j) => (
              <p key={`${i}-${j}`} className="m-0">
                {para.trim()}
              </p>
            ))
        ),
      )}
    </div>
  );
}
