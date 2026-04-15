import { Outlet } from "react-router-dom";
import Sidebar from "./SideBar";

const MainLayout = () =>{
    return (
        <div className="flex h-screen bg-zinc-50 overflow-hidden">
            {/* Sidebar */}
            <Sidebar/>

            <main className="flex-1 flex flex-col">
                <header className="h-16 bg-white border-b border-zinc-200 flex item-center px-8 shadow-sm">
                    <h2 className="text-sm font-medium text-zinc-500 uppercase tracking-wider">
                       Panel de Gestión de Oficios 
                    </h2>
                </header>
                {/* Bandejas */}
                <div className="p-5 flex-1 flex flex-col overflow-hidden">
                    <Outlet/>
                </div>
            </main>


        </div>
    );
};

export default MainLayout