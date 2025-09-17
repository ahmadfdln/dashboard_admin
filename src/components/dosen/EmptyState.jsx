export default function EmptyState({ icon: Icon, title, desc }) {
    return (
      <div className="flex flex-col items-center justify-center py-16 bg-gray-50 rounded-2xl border border-gray-200">
        <Icon size={48} className="text-gray-300 mb-4" />
        <h3 className="text-lg font-semibold text-gray-700">{title}</h3>
        <p className="text-sm text-gray-500 mt-1">{desc}</p>
      </div>
    );
  }
  