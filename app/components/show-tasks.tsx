import { useState, useEffect } from "react";
import toast from 'react-hot-toast';

interface Task {
  id: number;
  name: string;
  priority: number;
  tag: string;
  deadline: string;
  is_everyday: boolean;
  description?: string | null;
  period?: string | null;
  group?: string | null;
  assign?: string | null;
}

interface ShowTaskProps {
  setEditingTaskID: (id: number | null) => void;
  setActiveTab: (tab: string) => void;
}

const priorityColors = [
  // "#77C6FF", // 1
  // "#DBEAFE", // 2
  // "#33FF94", //3
  // "#FF4144"  // 5
  // "#74FF3D", //3
  // "#FFAA6D", //4
  // "#FF4144", // expired
  
  "#33FF94", //everyday
  "#77C6FF", // 1
  "#77C6FF", // 2
  "#77C6FF", // 3
  "#77C6FF", // 4
  "#77C6FF", // 5
  "#FF6751", //expired
];



//export function ShowTask({tasks}:{tasks:string[]}) {
export function ShowTask({ setEditingTaskID, setActiveTab }: ShowTaskProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const showTasks = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("トークンが見つかりません。ログインしてください。");
      return;
    }
    try {
      const response = await fetch("https://uprav.trap.show/api/tasks", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch tasks");
      }
      const tasks = await response.json();
      console.log("success:", tasks);
      setTasks(tasks);
    } catch (error) {
      console.error("エラー:", error);
      toast.error("通信エラーが発生しました");
    }
  };

  const deleteTask = async (task: Task) => {
    const token = localStorage.getItem("token");
    const taskId = task.id;
    if (!token) {
      toast.error("トークンが見つかりません。ログインしてください。");
      return;
    }
    console.log("delete task id: " + taskId);
    try {
      const response = await fetch(`https://uprav.trap.show/api/tasks/${taskId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to delete task");
      }
      console.log("success: task deleted (id: " + taskId + ")");
      setTasks(tasks.filter((task) => task.id !== taskId));
    } catch (error) {
      console.error("エラー:", error);
      toast.error("通信エラーが発生しました");
    }
  };

  const updateTask = async (taskId: number, updatedTask: Task) => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("トークンが見つかりません。ログインしてください。");
      return;
    }
    console.log("update task id: " + taskId);
    try {
      const response = await fetch(`https://uprav.trap.show/api/tasks/${taskId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedTask),
      });
      if (!response.ok) {
        throw new Error("Failed to update task");
      }
      console.log("success: task updated (id: " + taskId + ")");
    } catch (error) {
      console.error("エラー:", error);
      toast.error("通信エラーが発生しました");
    }
  };

  const doneEverydaytask = async (task: Task) => {
    console.log("Done everyday task id: " + task.id);
    const today = new Date().toLocaleDateString("sv-SE");
    const DoneTask: Task = {
      ...task,
      deadline: `${today}T00:00:00Z`,
    };
    await updateTask(task.id, DoneTask);
    setTasks(tasks.filter((tasks) => tasks.id !== task.id ));
  };

  useEffect(() => {
    showTasks();
  }, []);

  return (
    <div className="flex flex-col h-screen w-full bg-gray-100">
      <div className="flex h-20 justify-center items-center bg-blue-300">
        <h2 className="text-xl font-bold mb-6 mt-6 mr-4">タスク一覧</h2>
        {/* <button
          onClick={showTasks}
          className="ml-4 h-10 px-4 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
        >
          更新
        </button> */}
      </div>

      <div className="flex flex-col p-6">
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {sortTasks(tasks)
            .filter((task) =>{
              if (task.is_everyday) {
                const today = new Date().toLocaleDateString("sv-SE");
                const isDoneToday = task.deadline.startsWith(today);
                
                return !isDoneToday;
              }
              return true;
            })
            .map((task, index) => {
              let bgClass = "#F3F4F6";

              if (task.is_everyday) {
                bgClass = priorityColors[0];
              } 
              else if (isExpired(task.deadline)) {
                bgClass = priorityColors[6];
              } 
              else {
                bgClass = priorityColors[task.priority] || "#F3F4F6";
              }

              //const isUrgent = task.priority === 5;
              const isUrgent = false;
              return(
                <li
                  key={`${task.id}-${index}`}
                  style={{ backgroundColor: bgClass }}
                  onClick={() => setSelectedTask(task)}
                  className="card-interactive"
                >
                  <span className={`${isUrgent ? 'text-white font-bold' : 'text-gray-800 font-semibold'}`}>
                    {task.name}
                  </span>
                  <div className="flex flex-row items-center gap-1 pt-2">
                    <img src="https://img.icons8.com/?size=15&id=H0JqzxqGxPQm&format=png&color=000000" alt="from Icons8" />
                    <span className={`${isUrgent ? 'text-white' : 'text-gray-800'}font-medium`}>
                      {formatDeadline(task.deadline, task.is_everyday)}
                    </span>
                  </div>
                  <div className="flex flex-row items-center gap-1 pt-2">
                    <img src="https://img.icons8.com/?size=15&id=5342&format=png&color=000000" alt="from Icons8" />
                    <span className={`${isUrgent ? 'text-white' : 'text-gray-800'} font-medium`}>
                        {task.priority}
                    </span>
                  </div>
                </li>
              )
            })}
        </ul>
      </div>

      {selectedTask && (
        <div 
          className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 animate-fade-in"
          onClick={() => setSelectedTask(null)}
        >
          <div 
            className="bg-white rounded-2xl p-10 max-w-xl w-full mx-4 shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={() => setSelectedTask(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl"
            >
              ✕
            </button>

            <h3 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-5">
              {selectedTask.name}
            </h3>
            
            <div className="space-y-3 text-left">
              <div>
                <p className="text-sm text-gray-400 font-bold">期限</p>
                <p className="text-base text-gray-700">{formatDeadline(selectedTask.deadline, selectedTask.is_everyday)}</p>
              </div>

              <div>
                <p className="text-sm text-gray-400 font-bold">優先度</p>
                {/* <span className="inline-block text-xs font-bold px-2 py-1 rounded bg-gray-100 mt-1">
                  {selectedTask.priority}
                </span> */}
               <span className="text-base text-gray-700">
                  {selectedTask.priority}
                </span>
              </div>

              {selectedTask.tag && (
                <div>
                  <p className="text-sm text-gray-400 font-bold">タグ</p>
                  <span className="inline-block text-base bg-blue-50 text-blue-600 px-2 py-0.5 rounded mt-1">
                    #{selectedTask.tag}
                  </span>
                </div>
              )}
              
              {selectedTask.assign && (
                <div>
                  <p className="text-sm text-gray-400 font-bold">担当者</p>
                  <p className="text-base text-gray-700">👤 {selectedTask.assign}</p>
                </div>
              )}

              {selectedTask.description && (
                <div>
                  <p className="text-sm text-gray-400 font-bold">詳細</p>
                  <p className="text-base text-gray-700">{selectedTask.description}</p>
                </div>
              )}

              <div className="flex justify-center items-center pt-5 pt-10 gap-4 w-full">
                <button
                  className="bg-blue-500 text-white px-4 py-2 pr-2 pl-2 rounded-lg hover:bg-blue-600"
                  onClick={() => {
                    if (selectedTask.is_everyday) {
                      doneEverydaytask(selectedTask);
                    } else {
                      deleteTask(selectedTask);
                    }
                    setSelectedTask(null);
                  }}
                >
                  完了
                </button>
                <button
                  className="bg-blue-500 text-white px-4 py-2 pr-2 pl-2 rounded-lg hover:bg-blue-600"
                  onClick={() => {
                    setEditingTaskID(selectedTask.id);
                    setActiveTab("editTask");
                  }}
                >
                  編集
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const formatDeadline = (deadline: string, isEveryday: boolean): string => {
  if(isEveryday) return "毎日";

  const date = new Date(deadline);

  // 無効な日付文字列の場合はそのまま返す（エラー防止）
  if (isNaN(date.getTime())) return deadline;

  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  const currentYear = new Date().getFullYear();

  if (year === currentYear) {
    // 今年なら「月/日」
    return `${month}/${day}`;
  } else {
    // 今年以外なら「年/月/日」
    return `${year}/${month}/${day}`;
  }
};

const isExpired = (deadline: string): boolean => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const date = new Date(deadline);
  return date < today;
}

const sortTasks = (tasks: Task[]): Task[] => {
  const now = new Date();
  
  // 基準となる「今日」の「時刻」を 00:00:00.000 にリセットして日付のみで比較できるようにする
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  // 元の配列を壊さないようにスプレッド構文 `[...]` でコピーしてからソートする
  return [...tasks].sort((a, b) => {
    const dateA = new Date(a.deadline);
    const dateB = new Date(b.deadline);

    // 時間部分をクリアして日付のみにする
    const dA = new Date(dateA.getFullYear(), dateA.getMonth(), dateA.getDate());
    const dB = new Date(dateB.getFullYear(), dateB.getMonth(), dateB.getDate());

    // 1. 期限切れ（今日より前）かどうかの判定
    const isExpiredA = dA < today;
    const isExpiredB = dB < today;

    // 条件①: 期限切れのタスクは最優先で表示
    if (isExpiredA && !isExpiredB) return -1; // aが期限切れ、bが未期限ならaを先にする
    if (!isExpiredA && isExpiredB) return 1;  // bが期限切れ、aが未期限ならbを先にする

    // 両方とも期限切れ、または両方とも期限内（期限切れ同士、期限内同士）の場合の比較
    if (dA.getTime() !== dB.getTime()) {
      // 条件②: 期限が今日に近いほど先に表示（昇順: 日付が小さい＝古い・今日に近い方が先）
      // ただし「両方期限切れ」の場合は、より今日に近い（日付が大きい）方を先にしたい場合は `dB - dA` にします。
      // ここでは通常のタスク（期限内）の「今日に近い順（＝締切が早い順）」を優先しています。
      return dA.getTime() - dB.getTime();
    }

    // 条件③: 期限が全く同じなら、優先度が高いほど先に表示（降順: 優先度が大きい方が先）
    return b.priority - a.priority;
  });
};
