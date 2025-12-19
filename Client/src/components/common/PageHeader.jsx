function PageHeader({ title, subtitle, action }) {
  return (
    <div className="flex justify-between items-center mb-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
        {subtitle && <p className="text-gray-600 mt-1">{subtitle}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}

export default PageHeader;
