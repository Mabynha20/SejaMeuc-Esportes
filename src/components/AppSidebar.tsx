import { Users, Trophy, BarChart3 } from "lucide-react";

interface AppSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const tabs = [
  { id: "equipes", label: "Equipes", icon: Users },
  { id: "esportes", label: "Esportes", icon: Trophy },
  { id: "relatorios", label: "Relatórios", icon: BarChart3 },
];

export default function AppSidebar({ activeTab, onTabChange }: AppSidebarProps) {
  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-secondary flex flex-col z-50 rounded-r-3xl shadow-2xl">
      {/* Logo */}
      <div className="px-6 py-8 border-b border-sidebar-border">
        <h1 className="text-xl font-bold text-secondary-foreground tracking-wide" style={{ fontFamily: "'Playfair Display', serif" }}>
          🏆 SEJAMEUC
        </h1>
        <p className="text-xs text-sidebar-foreground/60 mt-1 font-sans">
          Controle de Esportes
        </p>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive
                  ? "bg-primary text-primary-foreground shadow-lg"
                  : "text-sidebar-foreground/80 hover:bg-primary/15 hover:text-primary"
              }`}
            >
              <tab.icon className="w-5 h-5" />
              {tab.label}
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-sidebar-border">
        <p className="text-[10px] text-sidebar-foreground/40 text-center">
          © 2026 SEJAMEUC
        </p>
      </div>
    </aside>
  );
}
