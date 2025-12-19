function Table({ headers = [], data = [], emptyMessage = 'No data available', className = '' }) {
  return (
    <div className="overflow-x-auto">
      <table className={`min-w-full divide-y divide-gray-200 ${className}`}>
        {headers.length > 0 && (
          <thead className="bg-gray-50">
            <tr>
              {headers.map((header, index) => (
                <th
                  key={index}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
        )}
        <tbody className="bg-white divide-y divide-gray-200">
          {data.length > 0 ? (
            data.map((row, rowIndex) => (
              <tr key={rowIndex} className="hover:bg-gray-50 transition-colors">
                {Object.values(row).map((cell, cellIndex) => (
                  <td
                    key={cellIndex}
                    className="px-6 py-4 text-sm text-gray-900"
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={headers.length || 1}
                className="px-6 py-4 text-center text-sm text-gray-500"
              >
                {emptyMessage}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

function TableHead({ children }) {
  return (
    <thead className="bg-gray-50">
      {children}
    </thead>
  );
}

function TableBody({ children }) {
  return (
    <tbody className="bg-white divide-y divide-gray-200">
      {children}
    </tbody>
  );
}

function TableRow({ children, className = '' }) {
  return (
    <tr className={`hover:bg-gray-50 transition-colors ${className}`}>
      {children}
    </tr>
  );
}

function TableHeader({ children, className = '' }) {
  return (
    <th className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${className}`}>
      {children}
    </th>
  );
}

function TableCell({ children, className = '' }) {
  return (
    <td className={`px-6 py-4 text-sm text-gray-900 ${className}`}>
      {children}
    </td>
  );
}

Table.Head = TableHead;
Table.Body = TableBody;
Table.Row = TableRow;
Table.Header = TableHeader;
Table.Cell = TableCell;

export default Table;
