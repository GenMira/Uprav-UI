import { useState } from "react";

interface TaskResponse {
  uid: string;            // uuid.UUID -> string
  name: string;
  priority: number;
  tag: string;
  deadline: string; 
  period?: string | null; 
  group?: string | null;  
  assign?: string | null; 
}

//export function ShowTask({tasks}:{tasks:string[]}) {
export function ShowTask() {
  const [tasks,setTasks] = useState<TaskResponse[]>([]);

  const showTasks = async () =>{
    try{
      const response = await fetch("https://uprav.trap.show/api/tasks",{
        method:"GET",
        headers:{
          "Content-Type":"application/json",
        },
      });
      if (!response.ok){
        throw new Error("Failed to fetch tasks");
      }
      const tasks = await response.json();
      console.log("success:",tasks);
      setTasks(tasks);
    }
    
    catch(error){
      console.error("エラー:", error);
      alert("通信エラーが発生しました");
    }
  };

  return(
    <div className="flex flex-col h-screen w-full bg-gray-200">
      <div className="flex h-20 justify-center items-center mb-6 bg-blue-300">
        <h2 className="text-xl font-bold mb-6 mt-6 mr-4">タスク一覧</h2>
        <button 
          onClick={showTasks}
          className="ml-4 h-10 px-4 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
        >
          更新
        </button>
      </div>

      <div className="flex flex-col bg-red-300 p-6">
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {tasks.map((task) => (
            <li 
              key={task.uid} 
              className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-xl hover:bg-gray-100 transition-colors transition-shadow flex flex-col items-center justify-center min-h-[120px] text-center break-words"
            >
              <span className="text-gray-800 font-semibold">{task.name}</span>
              <span className="text-gray-800 pt-2 font-medium">{formatDeadline(task.deadline)}</span>
              <span className="text-gray-800 pt-2 font-medium">pr:{task.priority}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

const formatDeadline = (deadline: string): string => {
  if (!deadline) return "";

  const date = new Date(deadline);
  
  // 無効な日付文字列の場合はそのまま返す（エラー防止）
  if (isNaN(date.getTime())) return deadline;

  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  const currentYear = new Date().getFullYear();

  if(year===2006){
    return "EveryDay";
  }

  if (year === currentYear) {
    // 今年なら「月/日」
    return `${month}/${day}`;
  } else {
    // 今年以外なら「年/月/日」
    return `${year}/${month}/${day}`;
  }
};