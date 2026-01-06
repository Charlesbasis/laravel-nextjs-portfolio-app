import { ReactNode } from 'react';
import { Loader2 } from 'lucide-react';

interface PortfolioSectionProps {
  title: string;
  children: ReactNode;
  isLoading?: boolean;
  isEmpty?: boolean;
  emptyMessage?: string;
  bgColor?: 'white' | 'gray';
  icon?: ReactNode;
}

export default function PortfolioSection({
  title,
  children,
  isLoading,
  isEmpty,
  emptyMessage = 'No items to display',
  bgColor = 'white',
  icon,
}: PortfolioSectionProps) {
  const bgClass = bgColor === 'white' ? 'bg-white' : 'bg-gray-50';

  return (
    <section className={`${bgClass} py-16`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 mb-8">
          {icon}
          <h2 className="text-3xl font-bold text-gray-900">{title}</h2>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="animate-spin text-blue-600" size={48} />
          </div>
        ) : isEmpty ? (
          <div className="text-center py-12">
            <p className="text-gray-500">{emptyMessage}</p>
          </div>
        ) : (
          children
        )}
      </div>
    </section>
  );
}
