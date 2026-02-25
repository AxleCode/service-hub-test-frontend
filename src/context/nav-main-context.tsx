import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { menu as fetchMenu } from "@/lib/side-menu";
import { Home, Store, User, Box, Settings2, GalleryVerticalEnd } from "lucide-react";
import { getIamAccess } from "@/lib/iam-access-list";
import { auth, state } from "@/config/constants";
import { getCookie } from "@/lib/cookies";

type NavMainContextType = {
  navMain: any[] | null;
  menuIamList: any[] | null;
  loading: boolean;
  error: string | null;
};

export const NavMainContext = createContext<NavMainContextType>({
  navMain: null,
  menuIamList: null,
  loading: true,
  error: null,
});

const normalizeMenuUrl = (rawPath?: string | null) => {
  if (!rawPath) {
    return "";
  }

  const path = rawPath.trim();
  if (!path) {
    return "";
  }

  if (path === "#") {
    return "#";
  }

  const isAbsoluteOrProtocol = /^([a-z][a-z\d+\-.]*:)?\/\//i.test(path) || /^[a-z][a-z\d+\-.]*:/i.test(path);
  if (isAbsoluteOrProtocol) {
    return path;
  }

  return path.startsWith("/") ? path : `/${path.replace(/^\/+/, "")}`;
};

function mapMenuToNavMain(menus: any): any[] {
  // This logic should match the one in app-sidebar.tsx
  const iconMap: Record<string, any> = {
    Home,
    Store,
    User,
    Box,
    Settings2,
    GalleryVerticalEnd,
  };

  return menus.map((item) => {
    let iconValue: any;
    if (typeof item.icon === "string" && (item.icon.endsWith(".png") || item.icon.startsWith("/") || item.icon.startsWith("http"))) {
      iconValue = item.icon;
    } else {
      iconValue = iconMap[item.icon] || iconMap.Box;
    }
    // Normalize url_path to absolute or protocol paths, keep '#' literal
    const urlValue = normalizeMenuUrl(item.url_path);

    return {
      id: item.id,
      title: item.text,
      url: urlValue,
      icon: iconValue,
      items: item.sub_menu ? mapMenuToNavMain(item.sub_menu) : undefined,
    };
  });
}

export const NavMainProvider = ({ children }: { children: ReactNode }) => {
  const [navMain, setNavMain] = useState<any[] | null>(null);
  const [menuIamList, setMenuIamList] = useState<any[] | null>(null);
  const [filteredNavMain, setFilteredNavMain] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Recursive function to filter navMain by menuIamList ids
  const filterNavMainByIamList = (navItems: any[], iamList: any[]): any[] => {
    return navItems
      .filter((navItem) => iamList.some((iam) => iam.id === navItem.id))
      .map((navItem) => ({
        ...navItem,
        items: navItem.items ? filterNavMainByIamList(navItem.items, iamList) : undefined,
      }));
  };


  useEffect(() => {
    const fetchData = async () => {
      // Skip fetching menu and IAM data on login page (when user is not logged in)
      const isLoggedIn = getCookie(auth.logged_in);
      if (isLoggedIn !== state.loggedIn) {
        setLoading(false);
        setNavMain(null);
        setMenuIamList(null);
        setFilteredNavMain([]);
        return;
      }

      setLoading(true);
      setError('');
      try {
        const res = await fetchMenu();
        console.log("Menu fetched:", res.data);
        const mapped = mapMenuToNavMain(res.data || []);
        console.log("Mapped menu:", mapped);
        setNavMain(mapped);

        const response = await getIamAccess();
        console.log("IAM access fetched:", response.data?.menu_access);
        const accessData = response.data?.menu_access || [];

        // Filter navMain by accessData ids including level 2 items if present
        // Create a set of access ids for quick lookup
        const accessIds = new Set(accessData.map((item: any) => item.id));

        // Recursive function to filter navMain by access ids, including all submenu items if any child has access
        const filterByAccess = (items: any[]): any[] => {
          return items
            .map((item) => {
              const filteredItems = item.items ? filterByAccess(item.items) : undefined;
              const hasAccess = accessIds.has(item.id);
              if (hasAccess || (filteredItems && filteredItems.length > 0)) {
                return {
                  ...item,
                  items: filteredItems,
                };
              }
              return null;
            })
            .filter(Boolean) as any[];
        };

        const filteredNav = filterByAccess(mapped);
        console.log("Filtered nav:", filteredNav);
        setMenuIamList(accessData);
        setFilteredNavMain(filteredNav);
        setLoading(false);
      } catch {
        // setError("Failed to load menu or IAM access");
        setLoading(false);
      }
    };

    fetchData();

    // Listen for custom login event
    const handleLogin = () => {
      fetchData();
    };

    window.addEventListener('userLoggedIn', handleLogin);

    return () => {
      window.removeEventListener('userLoggedIn', handleLogin);
    };
  }, []);

  useEffect(() => {
    if (navMain && menuIamList) {
      const filtered = filterNavMainByIamList(navMain, menuIamList);
      setFilteredNavMain(filtered);
    }
  }, [navMain, menuIamList]);

  return (
    <NavMainContext.Provider value={{ navMain: filteredNavMain, menuIamList, loading, error }}>
      {children}
    </NavMainContext.Provider>
  );
};

export function useNavMain() {
  return useContext(NavMainContext);
}
