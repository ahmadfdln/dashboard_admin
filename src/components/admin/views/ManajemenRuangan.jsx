import React, { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import { db, GeoPoint } from "../../../config/firebase";
import { addDoc, collection } from "firebase/firestore";
import { GoogleMap, useJsApiLoader, Marker } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "300px",
  borderRadius: "8px",
  marginBottom: "16px",
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
    toast.info("Sedang mengambil koordinat...");
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
      return toast.warn("Harap lengkapi semua field ruangan.");
    }
    const radiusValue = Number(radius);

    if (isNaN(radiusValue) || radiusValue < 10 || radiusValue > 20) {
      return toast.warn("Radius harus di antara 10 dan 20 meter.");
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
        `Menambahkan ruangan: ${kodeRuangan} di Gedung ${namaGedung} (radius ${radiusValue}m)`,
        "ROOM_CREATE"
      );
      toast.success("Ruangan berhasil ditambahkan!");

      // PERUBAHAN 3: Sesuaikan reset state radius
      setKodeRuangan("");
      setNamaGedung("");
      setLatitude("");
      setLongitude("");
      setRadius(20); // Diubah dari 100 ke 20
      setMarkerPosition(null);
      onActionSuccess();
    } catch (error) {
      console.error("Error menambah ruangan: ", error);
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
    <form
      onSubmit={handleTambahRuangan}
      className="space-y-4 bg-white p-8 rounded-xl shadow-sm border border-gray-100"
    >
                 {" "}
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Tambah Ruangan</h2> 
                           {" "}
      {isLoaded ? (
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={15}
          onClick={onMapClick}
        >
                             {" "}
          {markerPosition && <Marker position={markerPosition} />}             
           {" "}
        </GoogleMap>
      ) : (
        <div>Loading Peta...</div>
      )}
                 {" "}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         
        <div>
                             {" "}
          <label className="block text-sm font-medium text-gray-700">
            Kode Ruangan
          </label>
                             {" "}
          <input
            type="text"
            value={kodeRuangan}
            onChange={(e) => setKodeRuangan(e.target.value)}
            required
            className="mt-1 w-full p-2 border border-gray-300 rounded-md"
          />
                         {" "}
        </div>
                       {" "}
        <div>
                             {" "}
          <label className="block text-sm font-medium text-gray-700">
            Nama Gedung
          </label>
                             {" "}
          <input
            type="text"
            value={namaGedung}
            onChange={(e) => setNamaGedung(e.target.value)}
            required
            className="mt-1 w-full p-2 border border-gray-300 rounded-md"
          />
                         {" "}
        </div>
                   {" "}
      </div>
                 {" "}
      <div className="pt-2">
                         
        <button
          type="button"
          onClick={handleGetLocation}
          disabled={isGettingLocation}
          _
          className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400"
        >
                             {" "}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
              clipRule="evenodd"
            />
          </svg>
                             {" "}
          {isGettingLocation ? "Mencari Lokasi..." : "Dapatkan Lokasi Saat Ini"}
                         {" "}
        </button>
                   {" "}
      </div>
                 {" "}
      <p className="text-xs text-center text-gray-500 pt-1">
        Atau klik langsung pada peta untuk memilih lokasi.
      </p>
                             {" "}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                       {" "}
        <div>
                             {" "}
          <label className="block text-sm font-medium text-gray-700">
            Latitude
          </label>
                             {" "}
          <input
            type="number"
            step="any"
            value={latitude}
            onChange={(e) => setLatitude(e.target.value)}
            required
            placeholder="Otomatis terisi..."
            className="mt-1 w-full p-2 border border-gray-300 rounded-md bg-gray-50"
          />
                         {" "}
        </div>
                       {" "}
        <div>
                             {" "}
          <label className="block text-sm font-medium text-gray-700">
            Longitude
          </label>
                             {" "}
          <input
            type="number"
            step="any"
            value={longitude}
            onChange={(e) => setLongitude(e.target.value)}
            required
            placeholder="Otomatis terisi..."
            className="mt-1 w-full p-2 border border-gray-300 rounded-md bg-gray-50"
          />
                   {" "}
        </div>
                   {" "}
      </div>
                             {" "}
      <div className="pt-2">
                       {" "}
        <label className="block text-sm font-medium text-gray-700">
          Radius Absensi (meter):{" "}
          <span className="font-bold text-orange-600">{radius}m</span>
        </label>
        {/* PERUBAHAN 4: Ubah max di input range */}
                       {" "}
        <input
          type="range"
          min="10"
          max="20"
          step="1"
          value={radius}
          onChange={(e) => setRadius(e.target.value)}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer mt-2"
        />
        {/* PERUBAHAN 5: Ubah max di input number */}
                       {" "}
        <input
          type="number"
          min="10"
          max="20"
          step="1"
          value={radius}
          onChange={(e) => setRadius(e.target.value)}
          className="mt-2 w-full p-2 border border-gray-300 rounded-md"
        />
                   {" "}
      </div>
                 {" "}
      <div className="pt-4">
                       {" "}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-orange-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-orange-700 transition-colors disabled:bg-gray-400"
        >
                              {isLoading ? "Memproses..." : "Tambah Ruangan"}   
                     {" "}
        </button>
                   {" "}
      </div>
             {" "}
    </form>
  );
}
