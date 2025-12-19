function Alert({ children, type = 'info' }) {
  const types = {
    error: 'bg-red-50 border-red-200 text-red-800',
    success: 'bg-green-50 border-green-200 text-green-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800',
  };

  const icons = {
    error: '❌',
    success: '✅',
    warning: '⚠️',
    info: 'ℹ️',
  };

  return (
    <div className={`border rounded-lg p-4 mb-4 flex items-start gap-3 ${types[type]}`}>
      <span className="text-xl">{icons[type]}</span>
      <div className="flex-1">{children}</div>
    </div>
  );
}

export default Alert;
