export default function TaskCard({
  task,
  onDelete,
  onToggleStatus,
}) {  const isCompleted = task.status === "Completed";

  return (
    <div className="flex items-center justify-between rounded-xl border bg-white p-4 shadow-sm">
      
      <div className="flex items-center gap-3">
        
        {/* Status Indicator */}
     <button
  onClick={() => onToggleStatus(task.id)}
  className={`h-4 w-4 rounded-full border-2 ${
    isCompleted
      ? "border-green-500 bg-green-500"
      : "border-yellow-500"
  }`}
  title="Change task status"
></button>

        <div>
          <h3 className="font-medium text-slate-800">
            {task.title}
          </h3>

         <button
  onClick={() => onToggleStatus(task.id)}
  className={`mt-1 text-xs font-medium ${
    isCompleted
      ? "text-green-600"
      : "text-yellow-600"
  }`}
>
  {task.status}
</button>
        </div>

      </div>

      <button
        onClick={() => onDelete(task.id)}
        className="rounded-lg px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
      >
        Delete
      </button>

    </div>
  );
}