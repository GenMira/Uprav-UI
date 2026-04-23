import type { Route } from "./+types/home";
import { useState } from "react";
import {AddTask} from "../components/add-task";
import { Welcome } from "../welcome/welcome";
import { ShowTask } from "../components/show-tasks";
import { redirect } from "react-router";

// export async function loader() {
//   const user = await checkAuth();

//   if (!user) {
//     return redirect("/login");
//   }

//   return { user };
// }

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export function checkAuth():boolean{
  return(
    true
  );
}

export default function Home() {
  const [activeTab, setActiveTab] = useState("showTasks");
  const [tasks,setTasks] = useState<string[]>([]);

  const handleAddTask = (newTask: string) => {
    setTasks([...tasks, newTask]); 
  };

  return (
    <div className="flex h-screen w-full bg-gray-50">
      
      <nav className="w-64 border-r bg-[rgba(58,196,178,1)] p-6 space-y-4">
        <h2 className="font-bold text-xl mb-8">Uprav</h2>
        
        <button 
          onClick={() => setActiveTab("showTasks")}
          className={`block w-full text-left p-2 rounded ${activeTab === 'showTasks' ? 'bg-blue-100 text-blue-600' : 'hover:bg-[rgba(50,177,161,1)]'}`}
        >
          タスク一覧
        </button>

        <button 
          onClick={() => setActiveTab("welcome")}
          className={`block w-full text-left p-2 rounded ${activeTab === 'welcome' ? 'bg-blue-100 text-blue-600' : 'hover:bg-[rgba(50,177,161,1)]'}`}
        >
          ようこそ
        </button>

        <button 
          onClick={() => setActiveTab("addTask")}
          className={`block w-full text-left p-2 rounded ${activeTab === 'addTask' ? 'bg-blue-100 text-blue-600' : 'hover:bg-[rgba(50,177,161,1)]'}`}
        >
          タスク追加
        </button>
      </nav>

      <main className="flex-1 p-10 overflow-y-auto">
        {activeTab === "addTask" && <AddTask onAddTask={handleAddTask}/>}
        {activeTab === "welcome" && <Welcome />}
        {activeTab === "showTasks" && <ShowTask tasks={tasks} />}
      </main>
      
    </div>
  );
}

/* rounded-3xl	角を大きく丸めます */
/*border	1pxの枠線を引きます。*/
/*border-gray-200	枠線の色を薄いグレーに設定します。*/
/*p-6	内側に余白（パディング）を設けます（6 は 1.5rem = 24px 程度）。*/
/*dark:border-gray-700	ダークモード時の設定です。枠線の色を濃いグレーに変更します。 */
/*space-y-4	子要素の間に垂直方向のスペースを設けます（4 は 1rem = 16px 程度）。 */
/*max-w-[300px]	最大幅を300pxに制限*/
/*px-4	左右のパディング	内側の左右に 1rem (16px) の余白を作ります。 */
/*shadow-sm　影をつける */