type SectionPlaceholderProps = {
  title: string;
  description?: string;
};

const defaultDescription = "콘텐츠는 추후 추가 예정입니다.";

export default function SectionPlaceholder({ title, description }: SectionPlaceholderProps) {
  return (
    <div className="p-8">
      <div className="rounded-2xl border border-gray-100 bg-white p-6">
        <h1 className="typo-headline-s-bold text-gray-800">{title}</h1>
        <p className="mt-2 typo-body-m-medium text-gray-500">{description ?? defaultDescription}</p>
      </div>
    </div>
  );
}
