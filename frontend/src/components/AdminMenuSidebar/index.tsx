import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

export default function AdminMenuSidebar() {
  const navigate = useNavigate();

  const menuItems = [
    { label: '작업', path: '/admin/tasks' },
    { label: '리뷰', path: '/admin/reviews' },
    { label: '멤버 관리', path: '/admin/members' },
  ];

  return (
    <div className="flex h-full w-[280px] flex-col border-l border-gray-300 bg-gray-100 p-4">
      <h2 className="mb-4 text-lg font-semibold text-gray-800">메뉴</h2>
      <div className="flex flex-col gap-2">
        {menuItems.map((item) => (
          <button
            key={item.label}
            className={cn(
              'cursor-pointer rounded-md px-3 py-2 text-left text-gray-700 hover:bg-gray-200',
              'transition-colors focus:bg-gray-300 focus:outline-none'
            )}
            onClick={() => navigate(item.path)}
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
}
