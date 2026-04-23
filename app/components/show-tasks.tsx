export function ShowTask({tasks}:{tasks:string[]}) {
  return(
    <div className="flex flex-col h-screen w-full bg-gray-200">
      <div className="flex justify-center mb-6 bg-blue-300">
        <h2 className="text-xl font-bold mb-6 mt-6">タスク一覧</h2>
      </div>

      <div className="flex flex-col bg-red-300 p-6">
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {tasks.map((task, index) => (
            <li 
              key={index} 
              className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-xl hover:bg-gray-100 transition-colors transition-shadow flex items-center justify-center min-h-[120px] text-center break-words"
            >
              <span className="text-gray-800 font-medium bg-blue-200">{task}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}