import { dashItemsPrivate } from "@/mocks/dash-items-private";
import { MenuItem } from "./menu-item";

interface DashboardMenuProps {
  userRole?: string;
  className?: string;
}

export const DashboardMenu: React.FC<DashboardMenuProps> = ({ 
  userRole = "saler", 
  className = ""
}) => {
  // Filter items based on user role
  const filteredItems = dashItemsPrivate.filter(item => 
    item.roles.includes(userRole)
  );

  return (
    <div className={`w-full md:max-w-4xl lg:max-w-6xl mx-auto px-4 ${className}`}>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
        {filteredItems.map((item, index) => (
          <MenuItem
            key={`${item.routePath}-${index}`}
            item={item}
          />
        ))}
      </div>
      
      {filteredItems.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            Nenhuma ação liberada para o seu perfil
          </p>
        </div>
      )}
    </div>
  );
};