import { useState, useEffect } from "react";

interface TaskResponse {
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
const priorityColors = [
  // "#77C6FF", // 1
  // "#DBEAFE", // 2
  // "#33FF94", //3
  // "#FF6751", //4
  // "#FF4144"  // 5
  "#77C6FF", // 1
  "#77C6FF", // 2
  "#77C6FF", // 1
  "#77C6FF", // 2
  "#77C6FF", // 2
  // "#74FF3D", //3
  // "#FFAA6D", //4
  // "#FF4144", // 5
];

//export function ShowTask({tasks}:{tasks:string[]}) {
export function ShowTask() {
  const [tasks, setTasks] = useState<TaskResponse[]>([]);
  const [selectedTask, setSelectedTask] = useState<TaskResponse | null>(null);

  const showTasks = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("トークンが見つかりません。ログインしてください。");
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
      alert("通信エラーが発生しました");
    }
  };

  useEffect(() => {
    showTasks();
  }, []);

  return (
    <div className="flex flex-col h-screen w-full bg-gray-100">
      <div className="flex h-20 justify-center items-center bg-blue-300">
        <h2 className="text-xl font-bold mb-6 mt-6 mr-4">タスク一覧</h2>
        <button
          onClick={showTasks}
          className="ml-4 h-10 px-4 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
        >
          更新
        </button>
      </div>

      <div className="flex flex-col p-6">
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {sortTasks(tasks).map((task, index) => {
            const bgClass = priorityColors[task.priority-1] || "#F3F4F6";
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
            className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={() => setSelectedTask(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl"
            >
              ✕
            </button>

            <h3 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">
              {selectedTask.name}
            </h3>
            
            <div className="space-y-3 text-left">
              <div>
                <p className="text-xs text-gray-400 font-bold">期限</p>
                <p className="text-sm text-gray-700">{formatDeadline(selectedTask.deadline, selectedTask.is_everyday)}</p>
              </div>

              <div>
                <p className="text-xs text-gray-400 font-bold">優先度</p>
                {/* <span className="inline-block text-xs font-bold px-2 py-1 rounded bg-gray-100 mt-1">
                  {selectedTask.priority}
                </span> */}
               <span className="text-sm text-gray-700">
                  {selectedTask.priority}
                </span>
              </div>

              {selectedTask.tag && (
                <div>
                  <p className="text-xs text-gray-400 font-bold">タグ</p>
                  <span className="inline-block text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded mt-1">
                    #{selectedTask.tag}
                  </span>
                </div>
              )}
              
              {selectedTask.assign && (
                <div>
                  <p className="text-xs text-gray-400 font-bold">担当者</p>
                  <p className="text-sm text-gray-700">👤 {selectedTask.assign}</p>
                </div>
              )}

              {selectedTask.description && (
                <div>
                  <p className="text-xs text-gray-400 font-bold">詳細</p>
                  <p className="text-sm text-gray-700">{selectedTask.description}</p>
                </div>
              )}
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

const sortTasks = (tasks: TaskResponse[]): TaskResponse[] => {
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
