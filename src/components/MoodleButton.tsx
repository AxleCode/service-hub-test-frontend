"use client";

import { useState } from "react";
import { ExternalLink, Loader2 } from "lucide-react";
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { getEncryptedCredentials } from "@/lib/secure-storage";
import { api } from "@/lib/api-client";
import { toast } from "sonner";

interface LMSTokenData {
  token: string;
}

interface LMSTokenResponse {
  data: LMSTokenData;
  message: {
    id: string;
    en: string;
  };
}

interface ProfileData {
  jamaah_guid: string;
  jamaah_fullname: string;
  jamaah_email: string;
  jamaah_phone_number: string;
  // ... other fields
}

interface ProfileResponse {
  data: ProfileData;
  message: {
    id: string;
    en: string;
  };
}

export function MoodleButton() {
  const [isLoading, setIsLoading] = useState(false);

  const handleMoodleClick = async () => {
    setIsLoading(true);
    
    try {
      // Get decrypted credentials
      const credentials = await getEncryptedCredentials();
      
      if (!credentials) {
        toast.error("No saved credentials found. Please login again.");
        setIsLoading(false);
        return;
      }

      // Get profile data first
      const profileResponse: ProfileResponse = await api.post("/auth/profile");
      
      console.log("Profile Response:", profileResponse);
      
      if (!profileResponse?.data) {
        toast.error("Failed to get profile data");
        setIsLoading(false);
        return;
      }

      const profileData = profileResponse.data;
      console.log("Profile Data extracted:", profileData);

      // Call LMS token API
      const response: LMSTokenResponse = await api.post("/lms/token", {
        username: credentials.username,
        password: credentials.password,
      });

      if (response?.data?.token) {
        const token = response.data.token;
        
        // Get user data from profile and ensure they are strings
        const phone = credentials.username;
        const email = String(profileData.jamaah_email || "").trim();
        const fullname = String(profileData.jamaah_fullname || "").trim();
        
        // Debug logging
        console.log("Profile Data:", {
          phone,
          email,
          fullname,
          token: token.substring(0, 20) + "..."
        });
        
        // Encode URI components - ensure they are strings
        const encodedToken = encodeURIComponent(String(token));
        const encodedPhone = encodeURIComponent(phone);
        const encodedEmail = encodeURIComponent(email);
        const encodedFullname = encodeURIComponent(fullname);
        
        // Build the URL
        const lmsUrl = `https://lms.bethanyprofessional.com/auth/webappauth/autologin.php?token=${encodedToken}&username=${encodedPhone}&email=${encodedEmail}&fullname=${encodedFullname}`;
        
        console.log("LMS URL:", lmsUrl);
        
        // Open in new tab
        window.open(lmsUrl, "_blank", "noopener,noreferrer");
        
        toast.success("Opening Moodle...");
      } else {
        toast.error("Failed to get LMS token");
      }
    } catch (error: any) {
      console.error("Failed to open Moodle:", error);
      
      const errorMessage = 
        error?.response?.data?.message?.en || 
        error?.response?.data?.message || 
        "Failed to authenticate with LMS. Please try logging in again.";
      
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SidebarGroup>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton
            onClick={handleMoodleClick}
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-700 text-white data-[state=open]:bg-blue-700 data-[state=open]:text-white disabled:opacity-50 disabled:cursor-not-allowed"
            tooltip={isLoading ? "Loading..." : "Open Moodle"}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <ExternalLink className="h-4 w-4" />
            )}
            <span className="font-semibold">Moodle</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
  );
}

