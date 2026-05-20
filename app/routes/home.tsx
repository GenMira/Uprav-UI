import type { Route } from "./+types/home";
import { useState,useEffect } from "react";
import { useNavigate } from "react-router";
import {AddTask} from "../components/add-task";
import { Welcome } from "../welcome/welcome";
import { ShowTask } from "../components/show-tasks";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  const [activeTab, setActiveTab] = useState("showTasks");
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // const [tasks,setTasks] = useState<string[]>([]);

  // const handleAddTask = (newTask: string) => {
  //   setTasks([...tasks, newTask]); 
  // };

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      // トークンがなければログインへ強制送還（履歴を上書き）
      navigate("/login", { replace: true });
    } else {
      // トークンがあればアクセスを許可
      setIsAuthenticated(true);
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token"); // localStorageからtokenを削除
    navigate("/login", { replace: true }); // ログイン画面へリダイレクト
  };

  // 3. 認証が完了するまでは、一瞬のチラつきを防ぐために何も画面に出さない
  if (!isAuthenticated) {
    return null; 
  }

  return (
    <div className="flex h-screen w-full bg-gray-50">
      
      <nav className="hidden md:flex md:flex-col md:w-40 lg:w-64 border-r bg-[rgba(58,196,178,1)] p-6 space-y-4">
        <div className="space-y-4 w-full">
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
        </div>
        <div className="pt-4 border-t border-[rgba(50,177,161,1)] w-full">
          <button
            onClick={handleLogout}
            className="text-left w-full p-2 text-red-600 font-semibold rounded hover:bg-red-50 hover:text-red-700 transition-colors cursor-pointer"
          >
            ログアウト
          </button>
        </div>
      </nav>

      <main className="flex-1 p-10 overflow-y-auto">
        {/* {activeTab === "addTask" && <AddTask onAddTask={handleAddTask}/>} */}
        {activeTab === "addTask" && <AddTask />}
        {activeTab === "welcome" && <Welcome />}
        {activeTab === "showTasks" && <ShowTask />}
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