type PageHeaderProps = {
  title: string;
};

const PageHeader = ({ title }: PageHeaderProps) => {
  return (
    <div className="py-300 text-neutral-900">
      <h1 className="typo-headline-s-bold">{title}</h1>
    </div>
  );
};

export default PageHeader;
