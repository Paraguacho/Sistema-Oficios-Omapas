import { Outlet } from "react-router-dom";
import Sidebar from "./SideBar";
import ComposeModal from "./ComposeModal";
import { useState } from "react";

const MainLayout = () =>{
    const [isComposeOpen, setIsComposeOpen] = useState(false);
    return (
        <div className="flex h-screen bg-zinc-50 overflow-hidden">
            {/* Sidebar, abrira el modal */}
            <Sidebar onOpenCompose={() => setIsComposeOpen(true)} />
            <main className="flex-1 flex flex-col">
                
                {/* Bandejas */}
                <div className="p-5 flex-1 flex flex-col overflow-hidden">
                    <Outlet/>
                </div>
            </main>
            {isComposeOpen && (
                <ComposeModal>
                    onClose = {() => setIsComposeOpen(false)}
                    onSuccess={() => {
                        setIsComposeOpen(false);
                        alert("Oficio enviado?");
                    }}
                </ComposeModal>
            )}


        </div>
    );
};

export default MainLayout;