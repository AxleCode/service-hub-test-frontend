import React, { useState, useEffect } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { User as LucideUserIcon, Edit3, Loader2 } from "lucide-react";
import { FiCamera } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";


interface FamilyAltarPengurus {
  jamaah_id: string;
  pengurus_nama: string;
  pengurus_jabatan_status: string;
  pengurus_jabatan_image_url?: {
    filename: string;
    url_image: string;
  } | null;
}

interface FamilyAltarArea {
  guid: string;
  area_name: string;
}

interface FamilyAltarDetail {
  guid: string;
  nama_fa: string;
  kode_fa: string;
  area: FamilyAltarArea;
  address_fa: string;
  longitude: number;
  latitude: number;
  hari_fa: string;
  jam_fa: string;
  fa_wilayah: any;
  fa_sektor: any;
  fa_pengurus: FamilyAltarPengurus[];
  status: string;
  created_at: string;
  created_by: string;
  updated_at: string;
  updated_by: string;
  message: string;
}

interface FamilyAltar {
  detail: FamilyAltarDetail;
}

export type ProfilePicture = {
  filename?: string;
  url_image?: string;
}

interface UserData {
  profile_picture?: ProfilePicture;
  jamaah_guid: string;
  jamaah_fullname: string;
  jamaah_email: string;
  jamaah_phone_number: string;
  nama_divisi: string;
  area_id?: string;
  area_wilayah: string;
  nama_department: string;
  seksi_pelayanan: string;
  gender: string;
  date_of_birth: string;
  status: string;
  address?: string | null;
  family_altar?: FamilyAltar;
}

interface UserProfileCardsProps {
  userData: UserData;
  onProfileUpdated?: () => void;
}

import { api } from "@/lib/api-client";

function UserBasicInfoCard({ userData, onProfileUpdated }: UserProfileCardsProps) {
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleCameraClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log("handleFileChange triggered");
    const file = event.target.files?.[0];
    if (file) {
      console.log("File selected:", file);
      await uploadFile(file);
    }
  };

  const uploadFile = async (file: File) => {
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      console.log("Uploading file:", file);

      const response = await api.post("/media/upload", formData, {
        headers: {
          Accept: "application/json",
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Upload response:", response);

      const result = response.data;
      // Fix: response.data structure has data property containing url and filename
      const uploadedUrl = result.url ?? result.data?.url;
      const uploadedFilename = result.filename ?? result.data?.filename;

      console.log("Uploaded URL:", uploadedUrl);
      console.log("Uploaded Filename:", uploadedFilename);

      // After successful upload, update profile picture
      const updateSuccess = await updateProfilePicture(userData.jamaah_guid, {
        profile_picture: {
          url_image: uploadedUrl,
          filename: uploadedFilename,
        },
      });

      // Re-trigger profile fetch after successful update
      if (updateSuccess && onProfileUpdated) {
        toast.success("Profile picture updated successfully");
        // Add a small delay to ensure the API has processed the update
        setTimeout(() => {
          onProfileUpdated();
        }, 500);
      }

    } catch (error) {
      console.error("Error uploading file:", error);
      toast.error("Failed to upload profile picture");
    } finally {
      setIsUploading(false);
    }
  };

  const updateProfilePicture = async (guid: string, payload: any): Promise<boolean> => {
    try {
      const response = await api.put(`/jamaah/profile-picture/${guid}`, payload, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });
      console.log("Profile picture update response:", response);
      return true;
    } catch (error) {
      console.error("Error updating profile picture:", error);
      toast.error("Failed to update profile picture");
      return false;
    }
  };

  return (
    <div className="flex flex-col items-center p-8 bg-gradient-to-r from-indigo-500 via-purple-500 to-purple-300 rounded-2xl shadow-lg text-white">
      <div className="flex items-center space-x-4 relative">
        {isUploading ? (
          <Avatar className="w-32 h-32 ring-4 ring-white shadow-xl">
            <AvatarFallback className="bg-white/20">
              <Loader2 className="w-16 h-16 animate-spin text-white" />
            </AvatarFallback>
          </Avatar>
        ) : userData.profile_picture !== null ? (
          <Avatar className="w-32 h-32 ring-4 ring-white shadow-xl">
            <AvatarImage src={userData.profile_picture.url_image} alt="Profile Picture"  className="object-cover"  />
          </Avatar>
        ) : (
          <Avatar className="w-32 h-32 ring-4 ring-white shadow-xl">
            <AvatarFallback>
              <LucideUserIcon className="w-16 h-16" />
            </AvatarFallback>
          </Avatar>
        )}
        <FiCamera
          onClick={handleCameraClick}
          className={`cursor-pointer bg-white rounded-full p-1 shadow-md absolute right-0 bottom-0 translate-x-1/4 translate-y-3/4 text-gray-700 ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}
          size={24}
          aria-label="Upload new avatar"
        />
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          style={{ display: "none" }}
          onChange={handleFileChange}
        />
      </div>
      <div className="mt-4 text-center">
        <h2 className="text-3xl font-extrabold">{userData.jamaah_fullname}</h2>
        <p className="text-sm opacity-90">{userData.jamaah_email}</p>
        <p className="text-sm opacity-90">{userData.jamaah_phone_number}</p>
      </div>
    </div>
  );
}

function UserDetailsCard({ userData }: UserProfileCardsProps) {
  return (
    <div className="mt-6 bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md hover:shadow-xl transition-shadow duration-300 text-gray-800 dark:text-gray-200 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
      <div className="flex flex-col">
        <p className="mb-2 text-indigo-600 font-semibold uppercase tracking-wide">Division</p>
        <p className="text-lg font-semibold">{userData.nama_divisi}</p>
      </div>
      {/* <div className="flex flex-col">
        <p className="mb-2 text-indigo-600 font-semibold uppercase tracking-wide">Area</p>
        <p className="text-lg font-semibold">{userData.area_wilayah}</p>
      </div> */}
      <div className="flex flex-col">
        <p className="mb-2 text-indigo-600 font-semibold uppercase tracking-wide">Department</p>
        <p className="text-lg font-semibold">{userData.nama_department}</p>
      </div>
      <div className="flex flex-col">
        <p className="mb-2 text-indigo-600 font-semibold uppercase tracking-wide">Ministry</p>
        <p className="text-lg font-semibold">{userData.seksi_pelayanan}</p>
      </div>
      {/* <div className="flex flex-col">
        <p className="mb-2 text-indigo-600 font-semibold uppercase tracking-wide">Gender</p>
        <p className="text-lg font-semibold">{userData.gender}</p>
      </div> */}
      {/* <div className="flex flex-col">
        <p className="mb-2 text-indigo-600 font-semibold uppercase tracking-wide">Date of Birth</p>
        <p className="text-lg font-semibold">{userData.date_of_birth}</p>
      </div> */}
      <div className="flex flex-col">
        <p className="mb-2 text-indigo-600 font-semibold uppercase tracking-wide">Status</p>
        <p className="text-lg font-semibold">{userData.status}</p>
      </div>
      {/* <div className="flex flex-col">
        <p className="mb-2 text-indigo-600 font-semibold uppercase tracking-wide">Address</p>
        <p className="text-lg font-semibold">{userData.address || "N/A"}</p>
      </div> */}
    </div>
  );
}

function UserDetailsEditableCard({ userData, onProfileUpdated }: UserProfileCardsProps) {
  const [sheetOpen, setSheetOpen] = useState(false);
  const [areas, setAreas] = useState<Array<{ guid: string; value: string }>>([]);
  // Normalize gender value to match API expectations
  const normalizeGender = (gender: string) => {
    if (gender.toLowerCase() === 'male') return 'Male';
    if (gender.toLowerCase() === 'female') return 'Female';
    return gender; // Return as-is if not recognized
  };

  const [formData, setFormData] = useState({
    fullname: userData.jamaah_fullname,
    area_id: userData.area_id || "",
    address: userData.address || "",
    gender: normalizeGender(userData.gender),
    date_of_birth: userData.date_of_birth,
  });
  const [loading, setLoading] = useState(false);

  // Fetch areas for dropdown
  const fetchAreas = async () => {
    try {
      const response = await api.post("/masterdata_value/list", {
        filter: {
          set_reference_id: false,
          reference_id: 1,
          set_category: true,
          category: "Area Wilayah",
          set_value: false,
          value: "sta",
        },
        limit: 10000,
        page: 1,
        order: "created_at",
        sort: "DESC",
      });

      if (response && response.data) {
        setAreas(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch areas", error);
      toast.error("Failed to load area options");
    }
  };

  useEffect(() => {
    fetchAreas();
  }, []);

  // Update form data when userData changes
  useEffect(() => {
    setFormData({
      fullname: userData.jamaah_fullname,
      area_id: userData.area_id || "",
      address: userData.address || "",
      gender: normalizeGender(userData.gender),
      date_of_birth: userData.date_of_birth,
    });
  }, [userData]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        fullname: formData.fullname,
        area_id: formData.area_id,
        address: formData.address,
        profile_picture: userData.profile_picture ? {
          url_image: userData.profile_picture.url_image,
          filename: userData.profile_picture.filename
        } : null,
        gender: formData.gender,
        date_of_birth: formData.date_of_birth,
      };

      const response = await api.put(`/jamaah/${userData.jamaah_guid}`, payload, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });

      console.log("Profile update response:", response);
      console.log("Profile update payload:", payload);
      setSheetOpen(false);
      toast.success("Profile updated successfully");
      
      // Call the callback after successful update to retrigger profile fetch
      if (onProfileUpdated) {
        console.log("Calling onProfileUpdated for edit profile");
        // Call immediately first, then also call after delay as backup
        onProfileUpdated();
        setTimeout(() => {
          console.log("Executing onProfileUpdated callback (backup)");
          onProfileUpdated();
        }, 1000);
      } else {
        console.log("onProfileUpdated callback not available");
      }
    } catch (error) {
      console.error("Failed to update profile:", error);
      toast.error("Failed to update profile: " + (error instanceof Error ? error.message : String(error)));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="mt-6 bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md hover:shadow-xl transition-shadow duration-300 text-gray-800 dark:text-gray-200">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Profile Details</h3>
          <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <Edit3 className="w-4 h-4" />
                Edit Profile
              </Button>
            </SheetTrigger>
            <SheetContent className="w-[500px] h-full flex flex-col p-6">
              <SheetHeader className="flex-shrink-0 pb-6">
                <SheetTitle className="text-xl font-semibold">Edit Profile</SheetTitle>
              </SheetHeader>
              
              <form onSubmit={handleSubmit} className="flex-1 flex flex-col justify-between px-2">
                <div className="flex-1 flex flex-col space-y-6">
                  <div className="flex flex-col space-y-2">
                    <Label htmlFor="fullname" className="text-sm font-medium">Full Name</Label>
                    <Input
                      id="fullname"
                      value={formData.fullname}
                      onChange={(e) => handleInputChange("fullname", e.target.value)}
                      required
                      className="h-12 w-full px-3"
                    />
                  </div>

                  <div className="flex flex-col space-y-2">
                    <Label htmlFor="area_id" className="text-sm font-medium">Area</Label>
                    <Select value={formData.area_id} onValueChange={(value) => handleInputChange("area_id", value)}>
                      <SelectTrigger className="h-12 w-full px-3">
                        <SelectValue placeholder="Select area" />
                      </SelectTrigger>
                      <SelectContent>
                        {areas.map((area) => (
                          <SelectItem key={area.guid} value={area.guid}>
                            {area.value}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex flex-col space-y-2">
                    <Label htmlFor="address" className="text-sm font-medium">Address</Label>
                    <Input
                      id="address"
                      value={formData.address}
                      onChange={(e) => handleInputChange("address", e.target.value)}
                      className="h-12 w-full px-3"
                    />
                  </div>

                  <div className="flex flex-col space-y-2">
                    <Label htmlFor="gender" className="text-sm font-medium">Gender</Label>
                    <Select value={formData.gender} onValueChange={(value) => handleInputChange("gender", value)}>
                      <SelectTrigger className="h-12 w-full px-3">
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Male">Male</SelectItem>
                        <SelectItem value="Female">Female</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex flex-col space-y-2">
                    <Label htmlFor="date_of_birth" className="text-sm font-medium">Date of Birth</Label>
                    <Input
                      id="date_of_birth"
                      type="date"
                      value={formData.date_of_birth}
                      onChange={(e) => handleInputChange("date_of_birth", e.target.value)}
                      required
                      className="h-12 w-full px-3"
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-8 pb-2">
                  <Button type="submit" disabled={loading} className="flex-1 h-12">
                    {loading ? "Updating..." : "Update Profile"}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setSheetOpen(false)} className="flex-1 h-12">
                    Cancel
                  </Button>
                </div>
              </form>
            </SheetContent>
          </Sheet>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
          <div className="flex flex-col">
            <p className="mb-2 text-indigo-600 font-semibold uppercase tracking-wide">Area</p>
            <p className="text-lg font-semibold">{userData.area_wilayah}</p>
          </div>
          <div className="flex flex-col">
            <p className="mb-2 text-indigo-600 font-semibold uppercase tracking-wide">Gender</p>
            <p className="text-lg font-semibold">{userData.gender}</p>
          </div>
          <div className="flex flex-col">
            <p className="mb-2 text-indigo-600 font-semibold uppercase tracking-wide">Date of Birth</p>
            <p className="text-lg font-semibold">{userData.date_of_birth}</p>
          </div>
          <div className="flex flex-col">
            <p className="mb-2 text-indigo-600 font-semibold uppercase tracking-wide">Address</p>
            <p className="text-lg font-semibold">{userData.address || "N/A"}</p>
          </div>
        </div>
      </div>
    </>
  );
}

export default function UserProfileCards({ userData, onProfileUpdated }: UserProfileCardsProps) {

  return (
    <div className="space-y-8 p-8 bg-gray-50 dark:bg-gray-900 rounded-3xl shadow-2xl w-full max-w-full">
      <UserBasicInfoCard userData={userData} onProfileUpdated={onProfileUpdated} />
      <UserDetailsCard userData={userData} />
      <UserDetailsEditableCard userData={userData} />

      {userData.family_altar?.detail && (
        <>
          {userData.family_altar.detail.message == null ? (
            <section className="mt-6 bg-gradient-to-r from-indigo-600 via-purple-700 to-indigo-900 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-shadow duration-500 text-white max-w-full">
              <div className="flex justify-between mb-4">
                <div>
                  <h3 className="font-extrabold text-xl tracking-wide">{userData.family_altar.detail.nama_fa}</h3>
                  <p className="text-sm opacity-90">{userData.family_altar.detail.kode_fa}</p>
                  <p className="text-sm opacity-90">{userData.family_altar.detail.area.area_name}</p>
                </div>
                <div className="text-sm opacity-90 font-semibold">
                  {userData.family_altar.detail.hari_fa} - {new Date(`1970-01-01T${userData.family_altar.detail.jam_fa}`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
              <hr className="border-indigo-400 border-opacity-50 mb-6" />
              <div className="space-y-4">
                {userData.family_altar.detail.fa_pengurus.map((pengurus: any) => (
                  <div key={pengurus.jamaah_id} className="flex justify-between border-b border-indigo-400 border-opacity-30 pb-2 last:border-0">
                    <span className="font-semibold text-lg">{pengurus.pengurus_nama}</span>
                    <span className="opacity-90 text-sm">{pengurus.pengurus_jabatan_status}</span>
                  </div>
                ))}
              </div>
            </section>
          ) : (
            <section className="mt-6 bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg flex items-center justify-center text-center max-w-full min-h-[150px]">
              <p className="text-gray-700 dark:text-gray-300 text-lg font-semibold">
                {userData.family_altar.detail.message}
              </p>
            </section>
          )}
        </>
      )}
    </div>
  );
}
