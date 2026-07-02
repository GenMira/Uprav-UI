import { useState } from "react";
import toast from 'react-hot-toast';
// interface AddTaskProps {
//   onAddTask: (task: string) => void;
// }
interface TaskRequest {
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

//export function AddTask({ onAddTask }: AddTaskProps) {
export function AddTask() {
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

  const addTask = async () => {
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

    const newTask: TaskRequest = {
      name: taskName,
      priority: priority,
      deadline: formattedDeadline,
      is_everyday: isEverydayTask,
    };

    if (description.trim()) {
      newTask.description = description;
    }
    if (tagName.trim()) {
      newTask.tag = tagName;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("トークンが見つかりません。ログインしてください。");
      return;
    }

    try {
      const response = await fetch("https://uprav.trap.show/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(newTask),
      });

      if (!response.ok) {
        throw new Error("追加に失敗しました");
      }
      console.log("success:add Task");
      toast.success("タスクが追加されました！");
      resertForm();
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  return (
    <div className="flex flex-col items-center bg-gray-100 rounded-2xl">
      {/* overflow-y-auto */}
      <div className="h-1/3 w-full flex items-end justify-center">
        <h2 className="text-xl text-black pt-10 font-bold">タスク追加</h2>
      </div>

      <div className="flex flex-col md:flex-row w-full w-full justify-center items-center px-6 gap-2 pt-20 pb-10">
        <div className="md:w-[20%] text-black">タスク名</div>
        <input
          type="text"
          placeholder="新規タスク..."
          value={taskName}
          onChange={(e) => setTaskName(e.target.value)}
          className="w-[60%] p-2 text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="flex flex-col md:flex-row w-full w-full justify-center items-center px-6 gap-2 pt-10 pb-10">
        <div className="md:w-[20%] text-black">タグ</div>
        <input
          type="text"
          placeholder="タスクのタグ..."
          value={tagName}
          onChange={(e) => setTagName(e.target.value)}
          className="w-[60%] p-2 text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
          className="w-[60%] p-2 text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="flex flex-col w-full w-full justify-center items-center px-6 pt-10 pb-10">
        <div className="flex flex-col md:flex-row justify-center items-center w-full gap-2">
          <div className="md:w-[20%] text-black">タスクの締切</div>
          <input
            type="date"
            min={today}
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            className="w-[60%] p-2 text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex flex-row justify-between items-center w-[80%] pt-4 mx-auto">
          <div className="text-gray-700">毎日のタスクに設定</div>
          
          <input
            type="checkbox"
            checked={isEverydayTask}
            onChange={(e) => setIsEverydayTask(e.target.checked)}
            className="w-5 h-5 bg-white accent-blue-500 cursor-pointer"
          />
        </div>
      </div>
      {/* <div className="flex flex-row w-full w-full justify-center items-center px-6 gap-2 pt-10 pb-10">
        <div className="w-[20%]">完了の目安</div>
        <input
          type="date"
          className="w-[60%] p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div> */}
      <div className="flex flex-col md:flex-row w-full w-full justify-center items-center px-6 gap-2 pt-10 pb-10">
        <div className="md:w-[20%] text-black">説明</div>
        <input
          type="text"
          placeholder="タスクの詳細..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-[60%] p-2 text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="flex justify-center items-center pb-10 pt-10w-full">
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          onClick={() => addTask()}
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

    /* <div className="flex flex-row w-full w-full justify-center px-6 gap-4 pt-20">
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
            addTask(input.value);
            input.value = '';
          }
        }}
      >
        追加
      </button>
    */

    /*
    import { useRef } from "react";

      export function AddTask() {
        // 1. HTML要素への「参照」を作る
        const nameRef = useRef<HTMLInputElement>(null);
        const tagRef = useRef<HTMLInputElement>(null);

        const handleAdd = () => {
          // 2. currentプロパティから値を取り出す
          const name = nameRef.current?.value;
          const tag = tagRef.current?.value;

          if (name && tag) {
            console.log("2つの引数:", name, tag);
          }
        };

        return (
          <div className="flex flex-col gap-4">
            <input ref={nameRef} placeholder="タスク名" />
            <input ref={tagRef} placeholder="タグ" />
            <button onClick={handleAdd}>追加</button>
          </div>
        );
      }
    */
  );
}
