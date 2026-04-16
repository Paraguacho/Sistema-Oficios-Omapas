import { Outlet } from "react-router-dom";
import Sidebar from "./SideBar";

const MainLayout = () =>{
    return (
        <div className="flex h-screen bg-zinc-50 overflow-hidden">
            {/* Sidebar */}
            <Sidebar/>
            <main className="flex-1 flex flex-col">
                
                {/* Bandejas */}
                <div className="p-5 flex-1 flex flex-col overflow-hidden">
                    <Outlet/>
                </div>
            </main>


        </div>
    );
};

export default MainLayout