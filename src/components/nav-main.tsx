"use client";

import { ChevronRight, type LucideIcon } from "lucide-react";
import { useEffect, useState } from "react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { motion, AnimatePresence } from "framer-motion";
import clsx from "clsx";
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";
import { useLMSAuth } from "@/hooks/useLMSAuth";

type NavMainItem = {
  id?: string | number;
  title: string;
  url: string;
  icon?: string | LucideIcon;
  isActive?: boolean;
  items?: NavMainItem[];
};

export function NavMain({
  items,
}: {
  items: NavMainItem[];
}) {
  const pathname = usePathname();
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const { authenticateAndRedirect, isLoading: lmsLoading } = useLMSAuth();

  const getItemKey = (item: NavMainItem) => {
    if (item.id) return item.id.toString();
    if (item.url && item.url !== "#") return item.url;
    return item.title;
  };

  // Load expanded items from localStorage on mount
  useEffect(() => {
    const savedExpanded = localStorage.getItem("sidebar-expanded-items");
    if (savedExpanded) {
      try {
        const parsed: string[] = JSON.parse(savedExpanded);
        setExpandedItems(new Set(parsed));
      } catch (error) {
        console.error("Failed to parse expanded items from localStorage:", error);
      }
    }
  }, []);

  // Save expanded items to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("sidebar-expanded-items", JSON.stringify([...expandedItems]));
  }, [expandedItems]);

  // Helper function to check if the current path is active or inside a submenu
  const isActiveOrChildActive = (item: NavMainItem): boolean => {
    if (item.url === pathname) return true;
    if (item.items) {
      return item.items.some(isActiveOrChildActive);
    }
    return false;
  };

  // Check if an item should be expanded (either manually expanded or has active children)
  const isExpanded = (item: NavMainItem): boolean => {
    return expandedItems.has(getItemKey(item)) || isActiveOrChildActive(item);
  };

  // Toggle expanded state for an item (accordion behavior for top-level items only)
  const toggleExpanded = (item: NavMainItem, isTopLevel: boolean = false) => {
    const key = getItemKey(item);
    setExpandedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(key)) {
        newSet.delete(key);
      } else {
        if (isTopLevel) {
          const topLevelKeys = items.map(getItemKey);
          topLevelKeys.forEach(topKey => {
            if (topKey !== key) {
              newSet.delete(topKey);
            }
          });
        }
        newSet.add(key);
      }
      return newSet;
    });
  };

  // Handle click on menu items - intercept BPRO LMS
  const handleMenuClick = async (e: React.MouseEvent, item: NavMainItem) => {
    // Check if this is the BPRO LMS menu item
    if (item.title === "BPRO LMS" || item.title.toLowerCase().includes("bpro lms")) {
      e.preventDefault();
      e.stopPropagation();
      await authenticateAndRedirect();
      return false;
    }
    // For other items, allow normal navigation
    return true;
  };

  return (
    <SidebarGroup>
      {/* <SidebarGroupLabel>Platform</SidebarGroupLabel> */}
      <SidebarMenu>
        {items.map((item) => {
          const hasItems = (item?.items?.length || 0) > 0;
          // const isActive = isActiveOrChildActive(item);
          const expanded = isExpanded(item);
          return (
            <Collapsible
              key={item.title}
              asChild
              open={expanded}
              onOpenChange={() => toggleExpanded(item, true)}
              className="group/collapsible"
            >
              <SidebarMenuItem>
                {!hasItems && (
                  <SidebarMenuButton
                    tooltip={item.title}
                    isActive={item.url === pathname}
                    asLink={item.title !== "BPRO LMS" && !item.title.toLowerCase().includes("bpro lms")}
                    href={item.title === "BPRO LMS" || item.title.toLowerCase().includes("bpro lms") ? undefined : item.url}
                    onClick={(e) => {
                      if (item.title === "BPRO LMS" || item.title.toLowerCase().includes("bpro lms")) {
                        if (lmsLoading) {
                          e.preventDefault();
                          e.stopPropagation();
                          return;
                        }
                        handleMenuClick(e, item);
                      }
                    }}
                    className={clsx(
                      "transition-colors",
                      item.url === pathname ? "bg-blue-500 text-white" : "hover:bg-blue-100",
                      (item.title === "BPRO LMS" || item.title.toLowerCase().includes("bpro lms")) && "cursor-pointer",
                      lmsLoading && (item.title === "BPRO LMS" || item.title.toLowerCase().includes("bpro lms")) && "opacity-50 cursor-not-allowed"
                    )}
                  >

                    {item.icon &&
                      (typeof item.icon === "string" ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={item.icon}
                          alt={item.title + " icon"}
                          className="icon-img"
                          style={{ width: 13, height: 13, marginRight: 8, display: "inline-block", verticalAlign: "middle" }}
                        />
                      ) : (
                        <item.icon color={item.url === pathname ? "white" : "var(--foreground)"} />
                      ))}
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                )}
                {hasItems && (
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton
                      tooltip={item.title}
                      isActive={item.url === pathname}
                      className={clsx(
                        "transition-colors",
                        item.url === pathname ? "bg-blue-500 text-white" : "hover:bg-blue-100"
                      )}
                    >
                      {item.icon &&
                        (typeof item.icon === "string" ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={item.icon}
                            alt={item.title + " icon"}
                            className="icon-img"
                            style={{ width: 13, height: 13, marginRight: 8, display: "inline-block", verticalAlign: "middle" }}
                          />
                        ) : (
                          <item.icon color={item.url === pathname ? "white" : "var(--foreground)"} />
                        ))}
                      <span>{item.title}</span>
                      <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                )}

                <AnimatePresence initial={false}>
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {item.items?.map((subItem) => {
                          const hasSubItems = (subItem?.items?.length || 0) > 0;
                          // const isSubActive = isActiveOrChildActive(subItem);
                          const subExpanded = isExpanded(subItem);
                          return hasSubItems ? (
                            <Collapsible
                              key={subItem.title}
                              asChild
                              open={subExpanded}
                              onOpenChange={() => toggleExpanded(subItem)}
                              className="group/collapsible"
                            >
                              <SidebarMenuSubItem>
                                <CollapsibleTrigger asChild>
                                  <SidebarMenuSubButton
                                    isActive={subItem.url === pathname}
                                    className={clsx(
                                      "transition-colors",
                                      subItem.url === pathname ? "bg-blue-500 text-white" : "hover:bg-blue-100"
                                    )}
                                  >
                                    <span>{subItem.title}</span>
                                    <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                                  </SidebarMenuSubButton>
                                </CollapsibleTrigger>
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: "auto", opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  transition={{ duration: 0.3 }}
                                >
                                  <CollapsibleContent>
                                    <SidebarMenuSub>
                                      {subItem.items?.map((subSubItem) => {
                                        const hasSubSubItems = (subSubItem?.items?.length || 0) > 0;
                                        // const isSubSubActive = isActiveOrChildActive(subSubItem);
                                        const subSubExpanded = isExpanded(subSubItem);
                                        return hasSubSubItems ? (
                                          <Collapsible
                                            key={subSubItem.title}
                                            asChild
                                            open={subSubExpanded}
                                            onOpenChange={() => toggleExpanded(subSubItem)}
                                            className="group/collapsible"
                                          >
                                            <SidebarMenuSubItem>
                                              <CollapsibleTrigger asChild>
                                                <SidebarMenuSubButton
                                                  isActive={subSubItem.url === pathname}
                                                  className={clsx(
                                                    "transition-colors",
                                                    subSubItem.url === pathname ? "bg-blue-500 text-white" : "hover:bg-blue-100"
                                                  )}
                                                >
                                                  <span>{subSubItem.title}</span>
                                                  <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                                                </SidebarMenuSubButton>
                                              </CollapsibleTrigger>
                                              <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: "auto", opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.3 }}
                                              >
                                                <CollapsibleContent>
                                                  <SidebarMenuSub>
                                                    {subSubItem.items?.map((subSubSubItem) => {
                                                      // const isSubSubSubActive = isActiveOrChildActive(subSubSubItem);
                                                      const hasSubSubSubItems = (subSubSubItem?.items?.length || 0) > 0;
                                                      const subSubSubExpanded = isExpanded(subSubSubItem);
                                                      return hasSubSubSubItems ? (
                                                        <Collapsible
                                                          key={subSubSubItem.title}
                                                          asChild
                                                          open={subSubSubExpanded}
                                                          onOpenChange={() => toggleExpanded(subSubSubItem)}
                                                          className="group/collapsible"
                                                        >
                                                          <SidebarMenuSubItem>
                                                            <CollapsibleTrigger asChild>
                                                              <SidebarMenuSubButton
                                                                isActive={subSubSubItem.url === pathname}
                                                                className={clsx(
                                                                  "transition-colors",
                                                                  subSubSubItem.url === pathname ? "bg-blue-500 text-white" : "hover:bg-blue-100"
                                                                )}
                                                              >
                                                                <span>{subSubSubItem.title}</span>
                                                                <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                                                              </SidebarMenuSubButton>
                                                            </CollapsibleTrigger>
                                                            <motion.div
                                                              initial={{ height: 0, opacity: 0 }}
                                                              animate={{ height: "auto", opacity: 1 }}
                                                              exit={{ height: 0, opacity: 0 }}
                                                              transition={{ duration: 0.3 }}
                                                            >
                                                              <CollapsibleContent>
                                                                <SidebarMenuSub>
                                                                  {subSubSubItem.items?.map((subSubSubSubItem) => (
                                                                    <SidebarMenuSubItem key={subSubSubSubItem.title}>
                                                                      <SidebarMenuSubButton
                                                                        isActive={subSubSubSubItem.url === pathname}
                                                                        asChild
                                                                      >
                                                                        <a href={subSubSubSubItem.url}>
                                                                          <span>{subSubSubSubItem.title}</span>
                                                                        </a>
                                                                      </SidebarMenuSubButton>
                                                                    </SidebarMenuSubItem>
                                                                  ))}
                                                                </SidebarMenuSub>
                                                              </CollapsibleContent>
                                                            </motion.div>
                                                          </SidebarMenuSubItem>
                                                        </Collapsible>
                                                      ) : (
                                                        <SidebarMenuSubItem key={subSubSubItem.title}>
                                                          <SidebarMenuSubButton
                                                            isActive={subSubSubItem.url === pathname}
                                                            asChild
                                                          >
                                                            <a href={subSubSubItem.url}>
                                                              <span>{subSubSubItem.title}</span>
                                                            </a>
                                                          </SidebarMenuSubButton>
                                                        </SidebarMenuSubItem>
                                                      );
                                                    })}
                                                  </SidebarMenuSub>
                                                </CollapsibleContent>
                                              </motion.div>
                                            </SidebarMenuSubItem>
                                          </Collapsible>
                                        ) : (
                                          <SidebarMenuSubItem key={subSubItem.title}>
                                            <SidebarMenuSubButton
                                              isActive={subSubItem.url === pathname}
                                              asChild
                                            >
                                              <a href={subSubItem.url}>
                                                <span>{subSubItem.title}</span>
                                              </a>
                                            </SidebarMenuSubButton>
                                          </SidebarMenuSubItem>
                                        );
                                      })}
                                    </SidebarMenuSub>
                                  </CollapsibleContent>
                                </motion.div>
                              </SidebarMenuSubItem>
                            </Collapsible>
                          ) : (
                            <SidebarMenuSubItem key={subItem.title}>
                              <SidebarMenuSubButton
                                isActive={subItem.url === pathname}
                                asChild={subItem.title !== "BPRO LMS" && !subItem.title.toLowerCase().includes("bpro lms")}
                                onClick={(e) => {
                                  if (subItem.title === "BPRO LMS" || subItem.title.toLowerCase().includes("bpro lms")) {
                                    if (lmsLoading) {
                                      e.preventDefault();
                                      e.stopPropagation();
                                      return;
                                    }
                                    handleMenuClick(e, subItem);
                                  }
                                }}
                                className={clsx(
                                  (subItem.title === "BPRO LMS" || subItem.title.toLowerCase().includes("bpro lms")) && "cursor-pointer",
                                  lmsLoading && (subItem.title === "BPRO LMS" || subItem.title.toLowerCase().includes("bpro lms")) && "opacity-50 cursor-not-allowed"
                                )}
                              >
                                {subItem.title === "BPRO LMS" || subItem.title.toLowerCase().includes("bpro lms") ? (
                                  <span>{subItem.title}</span>
                                ) : (
                                  <a href={subItem.url}>
                                    <span>{subItem.title}</span>
                                  </a>
                                )}
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          );
                        })}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </motion.div>
                </AnimatePresence>
              </SidebarMenuItem>
            </Collapsible>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
