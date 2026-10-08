export default function TaskCard({
  task,
  onDelete,
  onStatusChange,
}) {
  const getStatusColor = () => {
    if (task.status === "Completed") {
      return "border-green-300 bg-green-50 text-green-700";
    }

    if (task.status === "In Progress") {
      return "border-blue-300 bg-blue-50 text-blue-700";
    }

    return "border-yellow-300 bg-yellow-50 text-yellow-700";
  };

  return (
    <div className="flex items-center justify-between rounded-xl border bg-white p-4 shadow-sm">

      {/* Task Information */}

      <div className="flex items-center gap-3">

        {/* Status Indicator */}

        <div
          className={`h-4 w-4 rounded-full border-2 ${
            task.status === "Completed"
              ? "border-green-500 bg-green-500"
              : task.status === "In Progress"
              ? "border-blue-500 bg-blue-500"
              : "border-yellow-500"
          }`}
        />

        <div>

          <h3 className="font-medium text-slate-800">
            {task.title}
          </h3>

          {/* Status Dropdown */}

          <select
            value={task.status}
            onChange={(e) =>
              onStatusChange(task.id, e.target.value)
            }
            className={`mt-2 rounded-lg border px-3 py-1.5 text-xs font-medium outline-none focus:ring-2 focus:ring-blue-100 ${getStatusColor()}`}
          >
            <option value="Pending">
              Pending
            </option>

            <option value="In Progress">
              In Progress
            </option>

            <option value="Completed">
              Completed
            </option>
          </select>

        </div>

      </div>

      {/* Delete Button */}

      <button
        type="button"
        onClick={() => onDelete(task.id)}
        className="rounded-lg px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
      >
        Delete
      </button>

    </div>
  );
}