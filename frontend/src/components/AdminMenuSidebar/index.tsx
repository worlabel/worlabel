import { useNavigate, useParams } from 'react-router-dom';
import { cn } from '@/lib/utils';

export default function AdminMenuSidebar() {
  const navigate = useNavigate();
  const { workspaceId, projectId } = useParams<{ workspaceId: string; projectId?: string }>();

  const menuItems = [
    { label: '리뷰', path: `/admin/${workspaceId}${projectId ? `/project/${projectId}` : ''}/reviews` },
    { label: '멤버 관리', path: `/admin/${workspaceId}${projectId ? `/project/${projectId}` : ''}/members` },
  ];

  return (
    <div className="flex h-full w-[280px] flex-col justify-between border-l border-gray-300 bg-gray-100">
      <div className="flex flex-col gap-2.5">
        <header className="subheading flex w-full items-center gap-2 px-5 py-2.5">
          <h2 className="w-full overflow-hidden text-ellipsis whitespace-nowrap">메뉴</h2>
        </header>
        <div className="flex flex-col gap-1 px-2.5">
          {menuItems.map((item) => (
            <button
              key={item.label}
              className={cn(
                'body cursor-pointer rounded-md px-3 py-2 text-left text-gray-800 hover:bg-gray-200',
                'transition-colors focus:bg-gray-300 focus:outline-none'
              )}
              onClick={() => navigate(item.path)}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
