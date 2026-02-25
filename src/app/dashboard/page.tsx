"use client";

import { isAxiosError } from "axios";
import { Cloud, MapPin, Thermometer, Droplets, Wind, RefreshCw } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { DashboardHeader } from "@/app/dashboard/components/DashboardHeader";
import { getDashboard } from "@/features/application/api/get-dashboard";
import type { WeatherDashboardData } from "@/features/application/types/dashboard";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

/** Koordinat Surabaya untuk request cuaca */
const SURABAYA_LAT = "-7.2575";
const SURABAYA_LON = "112.7521";

export default function DashboardPage() {
  const [weatherData, setWeatherData] = useState<WeatherDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboard = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getDashboard({
        latitude: SURABAYA_LAT,
        longitude: SURABAYA_LON,
      });
      if (response?.data) {
        setWeatherData(response.data);
      }
    } catch (err) {
      if (isAxiosError(err)) {
        const status = err.response?.status;
        const body = err.response?.data;
        console.error("[Dashboard] Request failed:", status, body ?? err.message);
        if (status === 500) {
          setError(
            "Server error (500). Periksa log backend atau coba lagi nanti. Pastikan endpoint /check-weather/info menerima GET dengan params longitude & latitude."
          );
          toast.error("Server error (500) – periksa backend");
        } else if (status === 404) {
          setError(
            "Endpoint cuaca tidak ditemukan (404). Pastikan backend menyediakan GET /check-weather/info."
          );
          toast.error("Endpoint tidak ditemukan (404)");
          console.error("Failed to fetch dashboard data:", err);
        } else {
          setError("Gagal memuat data cuaca");
          toast.error("Failed to load dashboard data");
        }
      } else {
        console.error("Failed to fetch dashboard data:", err);
        setError("Gagal memuat data cuaca");
        toast.error("Failed to load dashboard data");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  if (loading) {
    return (
      <div className="flex flex-col h-full">
        <DashboardHeader />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-muted-foreground">Mengambil lokasi & data cuaca...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error && !weatherData) {
    return (
      <div className="flex flex-col h-full">
        <DashboardHeader />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center text-muted-foreground max-w-sm space-y-4">
            <p>{error}</p>
            <Button onClick={() => fetchDashboard()} variant="outline" size="sm" className="gap-2">
              <RefreshCw className="h-4 w-4" />
              Coba lagi
            </Button>
          </div>
        </div>
      {/* Main Content */}
      </div>
    );
  }

  if (!weatherData) {
    return (
      <div className="flex flex-col h-full">
        <DashboardHeader />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-muted-foreground">Tidak ada data tersedia</p>
          </div>
        </div>
      </div>
    );
  }

  const location = weatherData.location;
  const current = weatherData.current;
  const condition = current?.condition;
  const conditionIcon = condition?.icon;
  const iconUrl =
    typeof conditionIcon === "string"
      ? conditionIcon.startsWith("//")
        ? `https:${conditionIcon}`
        : conditionIcon
      : null;

  return (
    <div className="flex flex-col h-full">
      <DashboardHeader />

      <div className="flex-1 overflow-auto p-6">
        <div className="space-y-6 max-w-2xl">
          {/* Location */}
          <section className="rounded-xl border bg-card p-4 shadow-sm">
            <div className="flex items-center gap-2 text-muted-foreground mb-2">
              <MapPin className="h-4 w-4" />
              <span className="text-sm font-medium">Lokasi</span>
            </div>
            <h2 className="text-xl font-semibold">
              {location?.name ?? "—"}
              {location?.region ? `, ${location.region}` : ""}
            </h2>
            <p className="text-sm text-muted-foreground">{location?.country ?? "—"}</p>
            <p className="text-xs text-muted-foreground mt-1">
              {location?.localtime ?? "—"}
              {location?.tz_id ? ` (${location.tz_id})` : ""}
            </p>
          </section>

          {/* Current weather */}
          <section className="rounded-xl border bg-card p-4 shadow-sm">
            <div className="flex items-center gap-2 text-muted-foreground mb-3">
              <Cloud className="h-4 w-4" />
              <span className="text-sm font-medium">Cuaca saat ini</span>
            </div>
            <div className="flex flex-wrap items-start gap-4">
              <div className="flex items-center gap-3">
                {iconUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={iconUrl}
                    alt={condition?.text ?? "Cuaca"}
                    className="h-14 w-14"
                  />
                )}
                <div>
                  <p className="text-3xl font-bold">{current?.temp_c != null ? `${current.temp_c}°C` : "—"}</p>
                  <p className="text-muted-foreground">{condition?.text ?? "—"}</p>
                  <p className="text-xs text-muted-foreground">
                    {current?.feelslike_c != null ? `Terasa seperti ${current.feelslike_c}°C` : ""}
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
              <div className="flex items-center gap-2 rounded-lg bg-muted/50 px-3 py-2">
                <Droplets className="h-4 w-4 text-muted-foreground" />
                <span>Kelembapan {current?.humidity ?? "—"}%</span>
              </div>
              <div className="flex items-center gap-2 rounded-lg bg-muted/50 px-3 py-2">
                <Wind className="h-4 w-4 text-muted-foreground" />
                <span>Angin {current?.wind_kph ?? "—"} km/j</span>
              </div>
              <div className="flex items-center gap-2 rounded-lg bg-muted/50 px-3 py-2">
                <Thermometer className="h-4 w-4 text-muted-foreground" />
                <span>Tekanan {current?.pressure_mb ?? "—"} mb</span>
              </div>
              <div className="flex items-center gap-2 rounded-lg bg-muted/50 px-3 py-2">
                <span className="text-muted-foreground">UV</span>
                <span>Indeks {current?.uv ?? "—"}</span>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
