import { useState, useEffect } from "react";
import toast from 'react-hot-toast';

interface GroupMember {
  uid: string;
  name: string;
}

interface Group {
  id: string;
  name: string;
  members: [GroupMember, ...GroupMember[]]; 
}

export function Group() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);


  const getGroups = async () => {
  const token = localStorage.getItem("token");
  if (!token) {
    toast.error("トークンが見つかりません。ログインしてください。");
    return;
  }
  try {
    const response = await fetch("https://uprav.trap.show/api/groups", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        console.log("グループが存在しません（404）");
        setGroups([]);
        return;
      }

      // 404 以外（500エラーなど）は、ステータスを付与したカスタムエラーを投げて catch に飛ばす
      const errorWithStatus = new Error("Failed to fetch groups") as any;
      errorWithStatus.status = response.status;
      throw errorWithStatus;
    }

    const groups = await response.json();
    console.log("success:", groups);
    setGroups(groups);

  } catch (error: any) {
    console.error("エラー:", error);
    toast.error("通信エラーが発生しました");
  }
};

  useEffect(() => {
    getGroups();
  }, []);

  return(
    <div className="flex flex-col min-h-screen w-full items-center bg-gray-100 rounded-2xl">
      <div className="h-20 w-full flex items-center justify-center bg-orange-200">
        <h2 className="text-xl text-black pt-5 pb-5 font-bold">グループ</h2>
      </div>
      <div className="flex justify-center items-center w-full px-6 pt-4 gap-5">
        <button
          className="hover:bg-black-200 text-grey font-bold py-2 px-4 rounded"
        >
          新規グループを作成
        </button>
        <button
          className="hover:bg-black-200 text-grey font-bold py-2 px-4 rounded"
        >
          グループに参加
        </button>
      </div>

      <div className="flex flex-col p-6">
        <ul className="grid grid-cols-1 gap-4">
          {groups.length !== 0 ? (
            groups.map((group, index) => {
              return(
                <li
                  key={`${group.id}-${index}`}
                  onClick={() => setSelectedGroup(group)}
                  className="card-interactive relative overflow-hidden bg-white"
                >
                  <div 
                    className="absolute top-0 left-0 right-0 h-[10%] bg-red-500"
                  />
                  <span className={'text-gray-800 font-semibold'}>
                    {group.name}
                  </span>
                </li>
              )
            })
          ):(
            <li className="text-gray-500 text-center">
            グループが見つかりません。<br />新規グループを作成するか、既存のグループに参加してください。
            </li>
          )}
        </ul>
      </div>
    </div>
  )
}