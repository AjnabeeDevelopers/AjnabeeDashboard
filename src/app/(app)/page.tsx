

"use client";
import { SalonTable } from "@/components/table";
import { SalonDataType } from "@/types/SalonDataType";
import { salonDataFetching } from "@/utils/firebaseAuth";
import { useEffect, useState } from "react";


export default function Home() {
  const [SalonData, setSalonData] = useState<SalonDataType[] |  null>([]); // Initialize as an empty array

  useEffect(() => {
    const fetchSalonData = async () => {
      const data = await salonDataFetching();
      setSalonData(data);
    };
    fetchSalonData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h1 className="text-4xl font-bold text-center mb-8">Salon Dashboard</h1>
      
      {/* Salon Stats Overview */}
      {SalonData && <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <p className="text-lg font-medium">Total Salons</p>
          <p className="text-3xl font-bold">{SalonData.length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <p className="text-lg font-medium">Verified Salons</p>
          <p className="text-3xl font-bold">{SalonData.filter(salon => salon.isverified).length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <p className="text-lg font-medium">Cities Covered</p>
          <p className="text-3xl font-bold">{new Set(SalonData.map(salon => salon.city)).size}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <p className="text-lg font-medium">Countries Covered</p>
          <p className="text-3xl font-bold">{new Set(SalonData.map(salon => salon.country)).size}</p>
        </div>
      </div>}

      {/* Salon Table */}
      {SalonData && <div className="bg-white p-4 rounded-lg shadow-md">
        {SalonData.length > 0 ? (
          <SalonTable data={SalonData} />
        ) : (
          <p className="text-center text-gray-500">Loading salon data...</p>
        )}
      </div>}
    </div>
  );
}
