import { useState } from "react";
import AppSidebar from "@/components/AppSidebar";
import EquipesPage from "./EquipesPage";
import EsportesPage from "./EsportesPage";
import RelatoriosPage from "./RelatoriosPage";

const Index = () => {
  const [activeTab, setActiveTab] = useState("equipes");

  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="flex-1 ml-64 p-8 lg:p-10">
        {activeTab === "equipes" && <EquipesPage />}
        {activeTab === "esportes" && <EsportesPage />}
        {activeTab === "relatorios" && <RelatoriosPage />}
      </main>
    </div>
  );
};

export default Index;
