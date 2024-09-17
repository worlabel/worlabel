interface TaskCardProps {
  projectName: string;
  taskName: string;
  status: string;
  taskType: string;
  labels: { name: string; count: number }[];
  createdOn: string;
  memberCount: number;
  width?: string;
  onClick?: () => void;
  statusColor?: string;
}

export default function TaskCard({
  projectName,
  taskName,
  status,
  taskType,
  labels,
  createdOn,
  memberCount,
  width = '100%',
  onClick,
  statusColor = 'text-yellow-600 dark:text-yellow-400',
}: TaskCardProps): JSX.Element {
  return (
    <div
      onClick={onClick}
      className="relative flex cursor-pointer flex-col items-start gap-4 overflow-hidden rounded-lg border border-gray-200 bg-white p-4 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:border-gray-800 dark:bg-gray-950 dark:hover:bg-gray-800 dark:hover:text-gray-50"
      style={{ width }}
    >
      <div className="flex w-full items-center gap-2.5">
        <div className="flex flex-1 flex-col">
          <div className="font-sans text-sm text-gray-500 dark:text-gray-400">{projectName}</div>
          <div className="font-sans text-lg font-semibold text-black dark:text-white">{taskName}</div>
        </div>
        <div className={`font-sans text-sm ${statusColor}`}>{status}</div>
      </div>

      <div className="flex w-full flex-col gap-2">
        <div className="font-sans text-sm text-gray-700 dark:text-gray-300">{taskType}</div>
        <div className="flex gap-2">
          {labels.map((label, index) => (
            <div
              key={index}
              className="inline-flex items-center gap-1 rounded border border-gray-300 bg-gray-100 px-2 py-1 dark:border-gray-700 dark:bg-gray-800"
            >
              <span className="text-sm text-gray-600 dark:text-gray-300">{label.name}</span>
              <span className="text-xs text-gray-500 dark:text-gray-400">({label.count})</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex w-full items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          <span>Created On:</span>
          <span>{createdOn}</span>
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-400">{`멤버 ${memberCount}명`}</div>
      </div>
    </div>
  );
}
