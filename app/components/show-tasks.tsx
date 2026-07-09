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
  "#FFAA6D", //today
];



//export function ShowTask({tasks}:{tasks:string[]}) {
export function ShowTask({ setEditingTaskID, setActiveTab }: ShowTaskProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const [isFilterON, setIsFilterON] = useState<boolean>(false);
  const [filterPriority, setFilterPriority] = useState<number>(0);
  const [isPriorityAbove, setIsPriorityAbove] = useState<boolean>(true);
  const [filterDate, setFilterDate] = useState("");
  const [isDateAbove,setIsDateAbove] = useState<boolean>(true);
  const today = new Date().toLocaleDateString("sv-SE");
  const [filterTag,setFilterTag] = useState("all");



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
      <div className="flex h-20 justify-center items-center bg-blue-300 gap-4 p-4">
        <h2 className="text-xl font-bold text-black">タスク一覧</h2>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsFilterON(!isFilterON)}
            className="text-xs font-semibold text-blue-800 bg-blue-200/60 px-2 py-1 rounded-md"
          >
            {isFilterON ? 'フィルター ON' : 'フィルター OFF'}
          </button>
          {/* <select
            value={filterMode}
            onChange={(e) => setFilterMode(e.target.value)}
            className="text-sm p-1.5 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
          >
            <option value="all">すべてのタスク</option>
            <option value="everyday">毎日のタスク</option>
            <option value="normal">通常のタスク</option>
            <option value="expired">期限切れのタスク</option>
          </select> */}
        </div>
      </div>
      {isFilterON && (
        <div className="flex flex-col justify-center items-center bg-blue-100 p-4 w-full rounded-xl shadow-sm">
          <span className="text-sm text-blue-800 font-semibold mb-2">
            検索条件
          </span>

          <div className="flex flex-col w-full max-w-xl justify-center items-center gap-2 px-6 py-2"> 
            <div className="flex flex-col md:flex-row w-full items-center gap-4 py-1.5 border-b border-blue-200/40">
              <div className="w-[18%] text-sm font-medium text-gray-600 shrink-0">優先度</div>
              <div className="flex-1 flex flex-col md:flex-row items-center gap-4">
                <select
                  value={filterPriority}
                  onChange={(e) => setFilterPriority(Number(e.target.value))}
                  className="text-sm text-black p-1.5 bg-white appearance-none border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                >
                  <option value={0}>-</option>
                  <option value={1}>1</option>
                  <option value={2}>2</option>
                  <option value={3}>3</option>
                  <option value={4}>4</option>
                  <option value={5}>5</option>
                </select>

                <div className="flex items-center gap-3 text-sm font-medium text-gray-600">
                  <label className="flex items-center gap-1 cursor-pointer select-none">
                    <input
                      type="radio"
                      name="priorityCondition"
                      value="gte"
                      checked={isPriorityAbove}
                      onChange={() => setIsPriorityAbove(true)}
                      className="w-4 h-4 bg-white text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 accent-blue-500 cursor-pointer"
                    />
                    <span className={isPriorityAbove ? "text-blue-600 font-bold" : ""}>以上</span>
                  </label>

                  <label className="flex items-center gap-1 cursor-pointer select-none">
                    <input
                      type="radio"
                      name="priorityCondition"
                      value="lte"
                      checked={!isPriorityAbove}
                      onChange={() => setIsPriorityAbove(false)}
                      className="w-4 h-4 bg-white text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 accent-blue-500 cursor-pointer"
                    />
                    <span className={!isPriorityAbove ? "text-blue-600 font-bold" : ""}>以下</span>
                  </label>

                  <button 
                    onClick={() => { setFilterPriority(0); setIsPriorityAbove(true); }}
                    className="text-xs text-gray-400 hover:text-red-500 transition-colors shrink-0"
                  >
                    リセット
                  </button>
                </div>
              </div>
            </div>

            <div className="flex flex-col md:flex-row w-full items-center gap-4 py-1.5 border-b border-blue-200/40">
              <div className="w-[18%] text-sm font-medium text-gray-600 shrink-0">締切日</div>
              <div className="flex-1 flex flex-col md:flex-row items-center gap-4">
                <input
                  type="date"
                  min={today}
                  value={filterDate}
                  onChange={(e) => setFilterDate(e.target.value)}
                  className="text-sm text-black p-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                />
                <div className="flex items-center gap-3 text-sm font-medium text-gray-600">
                  <label className="flex items-center gap-1 cursor-pointer select-none">
                    <input
                      type="radio"
                      name="DateCondition"
                      value="gte"
                      checked={isDateAbove}
                      onChange={() => setIsDateAbove(true)}
                      className="w-4 h-4 bg-white text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 accent-blue-500 cursor-pointer"
                    />
                    <span className={isDateAbove ? "text-blue-600 font-bold" : ""}>以降</span>
                  </label>

                  <label className="flex items-center gap-1 cursor-pointer select-none">
                    <input
                      type="radio"
                      name="DateCondition"
                      value="lte"
                      checked={!isDateAbove}
                      onChange={() => setIsDateAbove(false)}
                      className="w-4 h-4 bg-white text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 accent-blue-500 cursor-pointer"
                    />
                    <span className={!isDateAbove ? "text-blue-600 font-bold" : ""}>以前</span>
                  </label>
                  <button 
                    onClick={() => { setFilterDate(""); setIsDateAbove(true); }}
                    className="text-xs text-gray-400 hover:text-red-500 transition-colors shrink-0"
                  >
                    リセット
                  </button>
                </div>
              </div>
            </div>

            <div className="flex flex-col md:flex-row w-full items-center gap-4 py-1.5">
              <div className="w-[18%] text-sm font-medium text-gray-600 shrink-0">タグ</div>
              <div className="flex-1 flex flex-row items-center gap-4">
                <select
                  value={filterTag}
                  onChange={(e) => setFilterTag(e.target.value)}
                  className="text-sm text-black p-1.5 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                >
                  <option value="all">すべてのタグ</option>
                  <option value="none">タグなし</option>
                  {Array.from(
                    new Set(
                      tasks
                        .map((task) => task.tag)
                        .filter((tag) => tag && tag.trim() !== "")
                    )
                  ).map((tag) => (
                    <option key={tag} value={tag}>
                      {tag}
                    </option>
                  ))}
                </select>
                <button 
                  onClick={() => setFilterTag("all")}
                  className="text-xs text-gray-400 hover:text-red-500 transition-colors shrink-0"
                >
                  リセット
                </button>
              </div>
            </div>

            {/* 検索ボタンエリア
            <div className="w-full flex justify-center pt-3">
              <button
                className="bg-blue-500 text-white px-6 py-1.5 rounded-lg font-medium shadow-sm hover:bg-blue-600 transition-colors"
                onClick={() => searchTask()}
              >
                検索する
              </button>
            </div> */}

          </div>
        </div>
      )}

      <div className="flex flex-col p-6">
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {sortTasks(tasks)
            .filter((task) =>{
              if (task.is_everyday) {
                const now = new Date();
                const offsetDate = new Date(now.getTime() - 5 * 60 * 60 * 1000);
                const adjustedToday = offsetDate.toLocaleDateString("sv-SE");
                const isDoneToday = task.deadline.startsWith(adjustedToday);              
                if (isDoneToday) return false;
              }

              if(isFilterON){
                if(filterPriority!==0){
                  if (isPriorityAbove) {
                    if(task.priority<filterPriority){
                      return false
                    }
                  }
                  else{
                    if(task.priority>filterPriority){
                      return false
                    }
                  }
                }
                if(filterDate!==""){
                  const taskDateStr = task.deadline.substring(0, 10);
                  if(isDateAbove){
                    if(filterDate>taskDateStr){
                      return false
                    }
                  }
                  else{
                    if(filterDate<taskDateStr){
                      return false
                    }
                  }
                }
                if(filterTag!=="all"){
                  if(task.tag){
                    if(filterTag!==task.tag){
                      return false
                    }
                  }
                  else if(filterTag!=="none"){
                    return false
                  }
                }
              }

              return true
            })
            .map((task, index) => {
              //const isUrgent = task.priority === 5;
              const isUrgent = false;
              return(
                <li
                  key={`${task.id}-${index}`}
                  style={{ backgroundColor: getTaskBGColor(task) }}
                  onClick={() => setSelectedTask(task)}
                  className="card-interactive"
                >
                  <span className={`${isUrgent ? 'text-white font-bold' : 'text-gray-800 font-semibold'}`}>
                    {task.name}
                  </span>
                  <div className="flex flex-row items-center gap-1 pt-2">
                    <img src="https://img.icons8.com/?size=15&id=H0JqzxqGxPQm&format=png&color=000000" alt="from Icons8" />
                    <span className={`${isUrgent ? 'text-white' : 'text-gray-800'} font-medium`}>
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

const getTaskBGColor = (task : Task): string =>{
  if (task.is_everyday) {
    return priorityColors[0];
  }  

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const taskDate = new Date(task.deadline);
  const date = new Date(taskDate.getFullYear(), taskDate.getMonth(), taskDate.getDate()).getTime();

  if(date < today){
    return priorityColors[6]; // 期限切れ
  }

  if(date === today){
    console.log("today task: " + task.name);
    return priorityColors[7]; // 今日が締切
  }

  return priorityColors[task.priority] || "#F3F4F6";
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

    if (a.is_everyday && !b.is_everyday) return -1; // aが毎日タスクならaを先にする
    if (!a.is_everyday && b.is_everyday) return 1;  // bが毎日タスクならbを先にする
    if (a.is_everyday && b.is_everyday) return 0; // 両方とも毎日タスクなら順序は変えない

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
