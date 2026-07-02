import { useState, useEffect } from "react";
import toast from 'react-hot-toast';

interface Task {
  id:number;
  name: string;
  priority: number;
  deadline: string;
  is_everyday: boolean;
  tag?: string|null;
  description?: string| null;
  period?: string | null;
  group?: string | null;
  assign?: string | null;
}
interface ShowTaskProps {
  setEditingTaskID: (id: number | null) => void;
  setActiveTab: (tab: string) => void;
}

export function EditTask({editingTaskID, setEditingTaskID, setActiveTab}: {editingTaskID: number, setEditingTaskID: (id: number | null) => void, setActiveTab: (tab: string) => void }) {
  const [taskName, setTaskName] = useState("");
  const [tagName, setTagName] = useState("");
  const [priority, setPriority] = useState<number>(0);
  const [deadline, setDeadline] = useState("");
  const [isEverydayTask, setIsEverydayTask] = useState<boolean>(false);
  const [description, setDescription] = useState("");

  const today = new Date().toLocaleDateString("sv-SE");

  const resertForm = () => {
    setTaskName("");
    setTagName("");
    setPriority(0);
    setDeadline("");
    setIsEverydayTask(false);
    setDescription("");
  }

  const cansel = () =>{
    resertForm();
    setEditingTaskID(null);
    setActiveTab("showTasks");
  }

  const editTask = async () => {
    if(!taskName.trim()) {
      toast.error("タスク名を入力してください。");
      return;
    }

    if (priority > 5||priority < 1) {
      toast.error("優先度は1から5の数値で指定してください。");
      return;
    }
    if(!deadline&&!isEverydayTask) {
      toast.error("締切日を指定してください。");
      return;
    }

    let formattedDeadline = "";
    if (isEverydayTask) {
      formattedDeadline = "2006-05-11T00:00:00.000+09:00";
    } else {
      formattedDeadline = `${deadline}T00:00:00+09:00`;
    }

    const editedTask: Task = {
      id: editingTaskID,
      name: taskName,
      priority: priority,
      deadline: formattedDeadline,
      is_everyday: isEverydayTask,
    };

    if (description.trim()) {
      editedTask.description = description;
    }
    if (tagName.trim()) {
      editedTask.tag = tagName;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("トークンが見つかりません。ログインしてください。");
      return;
    }

    try {
      const response = await fetch(`https://uprav.trap.show/api/tasks/${editingTaskID}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(editedTask),
      });

      if (!response.ok) {
        throw new Error("編集に失敗しました");
      }
      console.log("success:edit Task");
      toast.success("タスクが編集されました！");
      setEditingTaskID(null);
      setActiveTab("showTasks");
    } catch (error) {
      console.error("Error editing task:", error);
    }
  };

  const getTaskDetails = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("トークンが見つかりません。ログインしてください。");
      return;
    }
    console.log("edit task id: " + editingTaskID);
    try {
      const response = await fetch(`https://uprav.trap.show/api/tasks/${editingTaskID}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({})); 
    
        // 2. JSON内のmessageプロパティ、またはHTTPのステータステキストを表示する
        const errorMessage = errorData.message || response.statusText;
        
        console.log("response error: " + errorMessage);
        throw new Error("Failed to fetch tasks");
      }
      const task = await response.json();
      console.log("success:", task);

          setTaskName(task.name || "");
          setTagName(task.tag || "");
          setPriority(task.priority || 0);
          
          // deadline から "T00:00:00" 部分を削って "YYYY-MM-DD" だけにして input[type="date"] に食わせる
          if (task.deadline) {
            setDeadline(task.deadline.split("T")[0]);
          }
          
          setIsEverydayTask(task.is_everyday || false);
          setDescription(task.description || "");
          
    } catch (error) {
      console.error("エラー:", error);
      toast.error("通信エラーが発生しました");
    }
  };

  useEffect(() => {
    getTaskDetails();
  }, []);


  return (
    <div className="flex flex-col items-center bg-gray-100 rounded-2xl">
      <div className="h-1/3 w-full flex items-end justify-center">
        <h2 className="text-xl pt-10 font-bold">タスク編集</h2>
      </div>
      <div className="flex items-right justify-center md:justify-end w-[80%] px-6 pt-4">
        <button
          className="bg-gray-100 text-black px-4 py-2 rounded-lg hover:bg-gray-300"
          onClick={() => cansel()}
        >
          キャンセル
        </button>
      </div>

      <div className="flex flex-col md:flex-row w-full w-full justify-center items-center px-6 gap-2 pt-10 md:pt-20 pb-10">
        <div className="md:w-[20%] text-black">タスク名</div>
        <input
          type="text"
          placeholder="新規タスク..."
          value={taskName}
          onChange={(e) => setTaskName(e.target.value)}
          className="w-[60%] p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="flex flex-col md:flex-row w-full w-full justify-center items-center px-6 gap-2 pt-10 pb-10">
        <div className="md:w-[20%] text-black">タグ</div>
        <input
          type="text"
          placeholder="タスクのタグ..."
          value={tagName}
          onChange={(e) => setTagName(e.target.value)}
          className="w-[60%] p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="flex flex-col md:flex-row w-full w-full justify-center items-center px-6 gap-2 pt-10 pb-10">
        <div className="md:w-[20%] text-black">優先度</div>
        <input
          type="number"
          min="1"
          max="5"
          placeholder="1~5の数値で入力..."
          value={priority === 0 ? "" : priority} 
          onChange={(e) => {
            const val = e.target.value;
            if (val === "") {
              setPriority(0);
            } else {
              setPriority(Number(val));
            }
          }}
          className="w-[60%] p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="flex flex-col w-full w-full justify-center items-center px-6 gap-2 pt-10 pb-10">
        <div className="flex flex-col md:flex-row justify-center items-center w-full gap-2">
          <div className="md:w-[20%] text-black">タスクの締切</div>
          <input
            type="date"
            min={today}
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            className="w-[60%] p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex flex-row justify-between items-center w-[80%] pt-4 mx-auto">
          <div className="text-gray-700">毎日のタスクに設定</div>
          
          <input
            type="checkbox"
            checked={isEverydayTask}
            onChange={(e) => setIsEverydayTask(e.target.checked)}
            className="w-5 h-5 accent-blue-500 cursor-pointer"
          />
        </div>
      </div>
      <div className="flex flex-col md:flex-row w-full w-full justify-center items-center px-6 gap-2 pt-10 pb-10">
        <div className="md:w-[20%]">説明</div>
        <input
          type="text"
          placeholder="タスクの詳細..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-[60%] p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="flex justify-center items-center pb-10 pt-10w-full">
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          onClick={() => editTask()}
        >
          更新
        </button>
      </div>
      
    </div>
  );
}