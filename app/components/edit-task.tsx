import { useState, useEffect } from "react";

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

export function EditTask({editingTaskID}: {editingTaskID: number}) {
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

  const editTask = async () => {
    if(!taskName.trim()) {
      alert("タスク名を入力してください。");
      return;
    }

    if (priority > 5||priority < 1) {
      alert("優先度は1から5の数値で指定してください。");
      return;
    }
    if(!deadline&&!isEverydayTask) {
      alert("締切日を指定してください。");
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
      alert("トークンが見つかりません。ログインしてください。");
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
      alert("タスクが編集されました！");
      resertForm();
    } catch (error) {
      console.error("Error editing task:", error);
    }
  };

  const getTaskDetails = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("トークンが見つかりません。ログインしてください。");
      return;
    }
    try {
      const response = await fetch(`https://uprav.trap.show/api/tasks/${editingTaskID}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch tasks");
      }
      const task = await response.json();
      console.log("success:", task);
    } catch (error) {
      console.error("エラー:", error);
      alert("通信エラーが発生しました");
    }
  };

  return (
    <div className="flex flex-col items-center bg-gray-100 rounded-2xl">
      <div className="h-1/3 w-full flex items-end justify-center">
        <h2 className="text-xl pt-10 font-bold">Edit Task</h2>
      </div>

      <div className="flex flex-row w-full w-full justify-center items-center px-6 gap-2 pt-20 pb-10">
        <div className="w-[20%]">タスク名</div>
        <input
          type="text"
          placeholder="新規タスク..."
          value={taskName}
          onChange={(e) => setTaskName(e.target.value)}
          className="w-[60%] p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="flex flex-row w-full w-full justify-center items-center px-6 gap-2 pt-10 pb-10">
        <div className="w-[20%]">タグ</div>
        <input
          type="text"
          placeholder="タスクのタグ..."
          value={tagName}
          onChange={(e) => setTagName(e.target.value)}
          className="w-[60%] p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="flex flex-row w-full w-full justify-center items-center px-6 gap-2 pt-10 pb-10">
        <div className="w-[20%]">優先度</div>
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
        <div className="flex flex-row justify-center items-center w-full">
          <div className="w-[20%]">タスクの締切</div>
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
      <div className="flex flex-row w-full w-full justify-center items-center px-6 gap-2 pt-10 pb-10">
        <div className="w-[20%]">説明</div>
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
          編集
        </button>
      </div>
      
    </div>
  );
}