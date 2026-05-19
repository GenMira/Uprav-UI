import { useState } from "react";
// interface AddTaskProps {
//   onAddTask: (task: string) => void;
// }
interface TaskRequest {
  uid: string;
  name: string;
  priority: number;
  tag: string;
  deadline: string;
  period?: string | null;
  group?: string | null;
  assign?: string | null;
}

//export function AddTask({ onAddTask }: AddTaskProps) {
export function AddTask() {
  const [taskName, setTaskName] = useState("");
  const [tagName, setTagName] = useState("");
  const [priority, setPriority] = useState<number>(0);

  const today = new Date().toLocaleDateString("sv-SE");

  const addTask = async () => {
    const newTask: TaskRequest = {
      uid: "550e8400-e29b-41d4-a716-446655440000",
      name: taskName,
      priority: priority,
      tag: tagName,
      deadline: new Date().toISOString(),
    };

    if(!taskName.trim()) {
      alert("必須事項を入力してください。");
      return;
    }

    if (priority > 5||priority < 1) {
      alert("優先度は1から5の数値で指定してください。");
      return;
    }

    try {
      const response = await fetch("https://uprav.trap.show/api/newtask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newTask),
      });

      if (!response.ok) {
        throw new Error("追加に失敗しました");
      }
      console.log("success:add Task");
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  return (
    <div className="flex flex-col items-center bg-gray-100 rounded-2xl">
      {/* overflow-y-auto */}
      <div className="h-1/3 w-full flex items-end justify-center">
        <h2 className="text-xl pt-10 font-bold">Add Task</h2>
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
      <div className="flex flex-row w-full w-full justify-center items-center px-6 gap-2 pt-10 pb-10">
        <div className="w-[20%]">タスクの締切</div>
        <input
          type="date"
          min={today}
          className="w-[60%] p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      {/* <div className="flex flex-row w-full w-full justify-center items-center px-6 gap-2 pt-10 pb-10">
        <div className="w-[20%]">完了の目安</div>
        <input
          type="date"
          className="w-[60%] p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div> */}

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
