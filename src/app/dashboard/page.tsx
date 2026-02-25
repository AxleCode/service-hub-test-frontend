"use client";

import { Droplet, Users } from "lucide-react";
import { useState, useEffect } from "react";
import { DashboardHeader } from "@/app/dashboard/components/DashboardHeader";
import { getDashboard } from "@/features/application/api/get-dashboard";
import { DashboardData } from "@/features/application/types/dashboard";
import { toast } from "sonner";

export default function DashboardPage() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        const response = await getDashboard();
        if (response?.data) {
          setDashboardData(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
        toast.error("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  // Format courses from API data
  const courses = dashboardData?.list_course?.map((course) => ({
    title: course.fullname || course.displayname || course.shortname,
    score: 0, // API doesn't provide score, using default
    location: "Location not available", // API doesn't provide location
    status: "Completed",
    completionDate: course.enddate
      ? new Date(course.enddate * 1000).toLocaleDateString("en-US", {
          month: "2-digit",
          day: "2-digit",
          year: "numeric",
        })
      : "N/A",
  })) || [];


  if (loading) {
    return (
      <div className="flex flex-col h-full">
        <DashboardHeader />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-muted-foreground">Loading dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="flex flex-col h-full">
        <DashboardHeader />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-muted-foreground">No data available</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <DashboardHeader />

      {/* Main Content */}
      <div className="flex-1 overflow-auto p-6">
        <div className="space-y-6">
 
        </div>
      </div>
    </div>
  );
}
