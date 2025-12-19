function StatCard({ title, value, gradient = 'from-purple-500 to-purple-700', icon }) {
  return (
    <div className={`bg-gradient-to-br ${gradient} text-white rounded-lg shadow-lg p-6 transform transition-all hover:scale-105`}>
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-sm font-medium opacity-90 mb-2">{title}</h3>
          <p className="text-3xl font-bold">{value}</p>
        </div>
        {icon && <div className="text-4xl opacity-80">{icon}</div>}
      </div>
    </div>
  );
}

export default StatCard;
