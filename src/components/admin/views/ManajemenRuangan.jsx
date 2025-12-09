import React, { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import { db, GeoPoint } from "../../../config/firebase";
import { addDoc, collection } from "firebase/firestore";
import { GoogleMap, useJsApiLoader, Marker } from "@react-google-maps/api";
import { MapPin } from "lucide-react";

const containerStyle = {
  width: "100%",
  height: "320px",
  borderRadius: "14px",
  overflow: "hidden",
};

const defaultCenter = {
  lat: 5.5563,
  lng: 95.3211,
};

export default function ManajemenRuangan({ onActionSuccess, logActivity }) {
  const [isLoading, setIsLoading] = useState(false);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [kodeRuangan, setKodeRuangan] = useState("");
  const [namaGedung, setNamaGedung] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [radius, setRadius] = useState(20);
  const [center, setCenter] = useState(defaultCenter);
  const [markerPosition, setMarkerPosition] = useState(null);

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  });

  useEffect(() => {
    if (latitude && longitude) {
      const newPos = {
        lat: parseFloat(latitude),
        lng: parseFloat(longitude),
      };
      setCenter(newPos);
      setMarkerPosition(newPos);
    }
  }, [latitude, longitude]);

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      return toast.error("Browser tidak mendukung Geolocation.");
    }
    setIsGettingLocation(true);
    toast.info("Mengambil lokasi...");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLatitude(position.coords.latitude.toString());
        setLongitude(position.coords.longitude.toString());
        toast.success("Lokasi berhasil didapatkan!");
        setIsGettingLocation(false);
      },
      (error) => {
        toast.error(`Gagal mendapatkan lokasi: ${error.message}`);
        setIsGettingLocation(false);
      },
      { enableHighAccuracy: true }
    );
  };

  const handleTambahRuangan = async (e) => {
    e.preventDefault();
    if (!kodeRuangan || !namaGedung || !latitude || !longitude || !radius) {
      return toast.warn("Semua field harus diisi.");
    }

    const radiusValue = Number(radius);
    if (isNaN(radiusValue) || radiusValue < 10 || radiusValue > 20) {
      return toast.warn("Radius harus 10–20 meter.");
    }

    setIsLoading(true);
    try {
      await addDoc(collection(db, "ruangKelas"), {
        kodeRuangan,
        namaGedung,
        lokasi: new GeoPoint(Number(latitude), Number(longitude)),
        radius: radiusValue,
      });

      await logActivity(
        `Menambahkan ruangan ${kodeRuangan} (${namaGedung}), radius ${radiusValue}m`,
        "ROOM_CREATE"
      );

      toast.success("Ruangan berhasil ditambahkan!");

      setKodeRuangan("");
      setNamaGedung("");
      setLatitude("");
      setLongitude("");
      setRadius(20);
      setMarkerPosition(null);
      onActionSuccess();
    } catch (error) {
      toast.error(`Gagal menambah ruangan: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const onMapClick = useCallback((event) => {
    setLatitude(event.latLng.lat().toString());
    setLongitude(event.latLng.lng().toString());
  }, []);

  return (
    <div className="w-full max-w-4xl mx-auto">
      <form
        onSubmit={handleTambahRuangan}
        className="space-y-8 bg-[#0f172a]/70 backdrop-blur-2xl border border-white/10 rounded-2xl p-8 shadow-2xl"
      >
        {/* HEADER */}
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-white/5 border border-white/10 rounded-xl">
            <MapPin className="w-6 h-6 text-purple-300" />
          </div>
          <h2 className="text-2xl font-bold text-white">Tambah Ruangan</h2>
        </div>

        {/* MAP */}
        {isLoaded ? (
          <div className="rounded-2xl overflow-hidden border border-white/10 shadow-lg">
            <GoogleMap
              mapContainerStyle={containerStyle}
              center={center}
              zoom={18}
              onClick={onMapClick}
              mapTypeId="satellite"
              options={{
                streetViewControl: false,
                fullscreenControl: false,
                backgroundColor: "#0f172a",
              }}
            >
              {markerPosition && <Marker position={markerPosition} />}
            </GoogleMap>
          </div>
        ) : (
          <div className="h-72 flex items-center justify-center bg-white/5 rounded-xl text-gray-400">
            Memuat peta...
          </div>
        )}

        {/* DATA RUANGAN */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-sm font-medium text-gray-300 mb-2 block">
              Kode Ruangan
            </label>
            <input
              type="text"
              value={kodeRuangan}
              onChange={(e) => setKodeRuangan(e.target.value)}
              className="w-full p-3 bg-black/20 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500 outline-none"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-300 mb-2 block">
              Nama Gedung
            </label>
            <input
              type="text"
              value={namaGedung}
              onChange={(e) => setNamaGedung(e.target.value)}
              className="w-full p-3 bg-black/20 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500 outline-none"
            />
          </div>
        </div>

        {/* BUTTON GET LOCATION */}
        <button
          type="button"
          onClick={handleGetLocation}
          disabled={isGettingLocation}
          className="w-full py-3 px-4 rounded-xl font-semibold  bg-emerald-500 hover:bg-emerald-600 text-black hover:opacity-90 flex items-center justify-center gap-2 shadow-lg transition-all"
        >
          {isGettingLocation ? "Mengambil lokasi..." : "Dapatkan Lokasi Saat Ini"}
        </button>

        <p className="text-center text-gray-400 text-xs">
          Atau klik langsung pada peta untuk memilih lokasi.
        </p>

        {/* LATITUDE / LONGITUDE */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          <div>
            <label className="text-sm font-medium text-gray-300 mb-2 block">
              Latitude
            </label>
            <input
              type="number"
              value={latitude}
              onChange={(e) => setLatitude(e.target.value)}
              className="w-full p-3 bg-black/20 border border-white/10 rounded-xl text-white placeholder-gray-500"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-300 mb-2 block">
              Longitude
            </label>
            <input
              type="number"
              value={longitude}
              onChange={(e) => setLongitude(e.target.value)}
              className="w-full p-3 bg-black/20 border border-white/10 rounded-xl text-white placeholder-gray-500"
            />
          </div>
        </div>

        {/* RADIUS */}
        <div className="pt-4">
          <label className="text-sm font-medium text-gray-300 mb-2 block">
            Radius Absensi (meter):
            <span className="font-semibold text-purple-300"> {radius}m</span>
          </label>

          <input
            type="range"
            min="10"
            max="20"
            value={radius}
            onChange={(e) => setRadius(e.target.value)}
            className="w-full bg-emerald-500 hover:bg-emerald-600 text-black"
          />

          <input
            type="number"
            min="10"
            max="20"
            value={radius}
            onChange={(e) => setRadius(e.target.value)}
            className="mt-2 w-full p-3 bg-black/20 border border-white/10 rounded-xl text-white placeholder-gray-500"
          />
        </div>

        {/* SUBMIT */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 px-4 rounded-xl font-bold  bg-emerald-500 hover:bg-emerald-600 text-black hover:opacity-90 transition-all shadow-lg"
        >
          {isLoading ? "Memproses..." : "Tambah Ruangan"}
        </button>
      </form>
    </div>
  );
}
