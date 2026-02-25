/**
 * Hook for handling LMS authentication and redirect
 * Used by BPRO LMS menu item to authenticate with Moodle
 */

import { useState } from "react";
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
}

interface ProfileResponse {
  data: ProfileData;
  message: {
    id: string;
    en: string;
  };
}

export function useLMSAuth() {
  const [isLoading, setIsLoading] = useState(false);

  const authenticateAndRedirect = async () => {
    setIsLoading(true);
    
    try {
      // Get decrypted credentials
      const credentials = await getEncryptedCredentials();
      
      if (!credentials) {
        toast.error("No saved credentials found. Please login again.");
        setIsLoading(false);
        return false;
      }

      // Get profile data first
      const profileResponse: ProfileResponse = await api.post("/auth/profile");
      
      console.log("Profile Response:", profileResponse);
      
      if (!profileResponse?.data) {
        toast.error("Failed to get profile data");
        setIsLoading(false);
        return false;
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
        setIsLoading(false);
        return true;
      } else {
        toast.error("Failed to get LMS token");
        setIsLoading(false);
        return false;
      }
    } catch (error: any) {
      console.error("Failed to open Moodle:", error);
      
      const errorMessage = 
        error?.response?.data?.message?.en || 
        error?.response?.data?.message || 
        "Failed to authenticate with LMS. Please try logging in again.";
      
      toast.error(errorMessage);
      setIsLoading(false);
      return false;
    }
  };

  return { authenticateAndRedirect, isLoading };
}

