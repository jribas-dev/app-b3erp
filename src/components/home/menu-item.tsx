import { DashItem } from "@/types/dash-item";
import Link from "next/link";

interface MenuItemProps {
  item: DashItem;
}

export const MenuItem: React.FC<MenuItemProps> = ({ item }) => {
  const IconComponent = item.iconComponent;
  
  return (
    <Link
      href={item.routePath}
      className="group relative bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-600
                 hover:shadow-md hover:border-blue-300 transition-all duration-200 
                 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                 md:aspect-square sm:aspect-[4/1] p-4 sm:p-6 md:flex items-center justify-center
                 hover:scale-[1.02] active:scale-[0.98] block"
    >
      <div className="flex sm:flex-col md:flex-col items-center justify-start sm:justify-center 
                      space-x-4 sm:space-x-0 sm:space-y-3 md:space-y-3 w-full">
        <div className="flex-shrink-0 p-2 sm:p-3 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 
                         dark:from-indigo-600 dark:to-indigo-800 
                        group-hover:from-blue-200 group-hover:to-indigo-200 
                        dark:group-hover:from-indigo-500 dark:group-hover:to-indigo-700 
                        transition-colors duration-200">
          <IconComponent />
        </div>
        <span className="text-md font-medium text-gray-800 dark:text-white text-left sm:text-center leading-tight
                         group-hover:text-gray-900 transition-colors duration-200
                         max-w-full break-words flex-1 sm:flex-none">
          {item.name}
        </span>
      </div>
      
      {/* Subtle gradient overlay on hover */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-blue-500/0 to-indigo-500/0 
                      group-hover:from-blue-500/5 group-hover:to-indigo-500/5 
                      transition-all duration-200 pointer-events-none" />
    </Link>
  );
};
