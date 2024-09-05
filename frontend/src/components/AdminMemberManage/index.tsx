import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import AdminMemberManageForm, { MemberManageFormValues } from './AdminMemberManageForm';
import { Button } from '@/components/ui/button';

type Role = 'admin' | 'editor' | 'viewer';

interface Member {
  email: string;
  role: Role;
}

interface Project {
  id: string;
  name: string;
}

export default function AdminMemberManage({
  title = '멤버 관리',
  projects,
  onProjectChange,
  onSubmit,
  members,
  onMemberInvite,
}: {
  title?: string;
  projects: Project[];
  onProjectChange: (projectId: string) => void;
  onSubmit: (data: MemberManageFormValues) => void;
  members: Member[];
  onMemberInvite: () => void;
}) {
  return (
    <div className="flex w-full flex-col gap-6 border-b-[0.67px] border-[#dcdcde] bg-[#fbfafd] p-6">
      <header className="flex w-full items-center gap-4">
        <h1 className="flex-1 text-lg font-semibold text-[#333238]">{title}</h1>
        <Button
          variant="outlinePrimary"
          onClick={onMemberInvite}
        >
          멤버 초대하기
        </Button>
        <Select onValueChange={onProjectChange}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="프로젝트 선택" />
          </SelectTrigger>
          <SelectContent>
            {projects.map((project) => (
              <SelectItem
                key={project.id}
                value={project.id}
              >
                {project.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </header>
      <AdminMemberManageForm
        onSubmit={onSubmit}
        members={members}
      />
    </div>
  );
}
