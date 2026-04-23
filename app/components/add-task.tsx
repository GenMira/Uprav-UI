interface AddTaskProps {
  onAddTask: (task: string) => void;
}

export function AddTask({ onAddTask }: AddTaskProps) {
  return(
    <div className="flex flex-col items-center h-80 bg-gray-100 rounded-2xl">
      <div className="h-1/3 w-full flex items-end justify-center">
        <h2 className="text-xl font-bold">Add Task</h2>
      </div>

      <div className="flex flex-row w-full w-full justify-center px-6 gap-4 pt-20">
        <input 
          type="text" 
          placeholder="新規タスク..."
          className="w-2/3 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button 
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          onClick={() => {
            const input = document.querySelector('input') as HTMLInputElement;
            if (input) {
              onAddTask(input.value);
              input.value = '';
            }
          }}
        >
          追加
        </button>
      
      </div>

    </div>
    // <div className="flex flex-col items-center h-64 bg-gray-100 rounded-2xl">
    //   {/* 1. タイトルエリア (上から1/3) */}
    //   <div className="h-1/3 w-full flex items-end justify-center pb-4">
    //     <h2 className="text-xl font-bold">Add Task</h2>
    //   </div>

    //   {/* 2. 入力欄とボタンのエリア */}
    //   {/* ここで w-full を指定して親いっぱいに広げた上で、中の input を w-2/3 にします */}
    //   <div className="flex flex-row gap-2 w-full justify-center px-6">
    //     <input 
    //       type="text" 
    //       placeholder="タスクを入力..." 
    //       className="w-2/3 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
    //     />
    //     <button className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 shrink-0">
    //       追加
    //     </button>
    //   </div>
    // </div>
  )

}