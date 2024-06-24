export function PostHeader({
  title,
  date,
  locale = "en-US",
}: {
  title: string;
  date: Date | null;
  locale?: string;
}) {
  const dateDisplay = date
    ? new Date(date).toLocaleDateString(locale, { dateStyle: "long" })
    : null;

  return (
    <div className="text-center">
      <div className="mx-auto max-w-5xl text-balance px-4 font-serif text-3xl sm:text-4xl xl:text-5xl">
        {title}
      </div>
      {date && (
        <div className="my-8">
          <span className="text-md relative border-t-2 border-lime px-4 py-1.5 font-serif">
            {dateDisplay}
          </span>
        </div>
      )}
    </div>
  );
}
