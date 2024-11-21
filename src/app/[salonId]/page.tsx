"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {  useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  fetchAllCategoriesBySalonId,
  fetchBookingsBySalonCode,
  fetchSalonById,
  fetchSalonVerificationStatus,
  toggleSalonVerificationStatus,
} from "@/utils/firebaseAuth";
import { useForm } from "react-hook-form";
import { SalonVerificationSchema } from "@/schemas/VerfiySalonSchema";
import { BookingCard } from "./BookingCards";
import { BookingType } from "@/types/BookingDataType";
import { SalonDataType } from "@/types/SalonDataType";
import { salonCategoryType } from "@/types/SalonCategoryDatatype";
import ServiceCard from "./ServiceCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const Page = () => {
  const [loadingSalons, setLoadingSalons] = useState(true);
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);
  const [SalonData, setSalonData] = useState<SalonDataType | null>(null);
  const [isVerifiedSalonStatus, setIsVerifiedSalonStatus] = useState<boolean | null>(false);
  const [bookings, setBookings] = useState<BookingType[] | null>(null);
  const [SalonCategoriesData, setSalonCategoriesData] = useState<salonCategoryType[] | null>(null)
  const [LoadingCategoriesSalons, setLoadingCategoriesSalons] = useState(false)

  const { register, watch, setValue } = useForm({
    resolver: zodResolver(SalonVerificationSchema),
  });

  const params = useParams();
  const acceptMessages = watch("salonVerification");

  // Fetch salon data by ID
  useEffect(() => {
    const fetchSalonData = async () => {
      setLoadingSalons(true);
      const data = await fetchSalonById(params.salonId as string);
      const Bookingdata = await fetchBookingsBySalonCode(data?.salonCode as string);
      setIsVerifiedSalonStatus(data?.isverified as boolean);
      setBookings(Bookingdata);
      setSalonData(data);
      setLoadingSalons(false);
    };
    fetchSalonData();
  }, [params.salonId]);

  // Fetch salon categories by ID
  useEffect(() => {
    const fetchSalonData = async () => {
      setLoadingCategoriesSalons(true);
      const data = await fetchAllCategoriesBySalonId(params.salonId as string);
      console.log(data)
      setSalonCategoriesData(data);
      setLoadingCategoriesSalons(false);
    };
    fetchSalonData();
  }, [params.salonId]);

  // Fetch initial verification status
  useEffect(() => {
    const fetchVerificationStatus = async () => {
      setIsSwitchLoading(true);
      try {
        const status = await fetchSalonVerificationStatus(params.salonId as string);
        setValue("salonVerification", status);
        setIsVerifiedSalonStatus(status);
      } catch (error) {
        console.error(error);
      } finally {
        setIsSwitchLoading(false);
      }
    };
    if (params.salonId) {
      fetchVerificationStatus();
    }
  }, [params.salonId, setValue]);

  const handleSwitchChange = async () => {
    setIsSwitchLoading(true);
    try {
      const newStatus = await toggleSalonVerificationStatus(params.salonId as string);
      setValue("salonVerification", newStatus);
    } catch (error) {
      console.error("Error toggling verification status:", error);
    } finally {
      setIsSwitchLoading(false);
    }
  };

  if (loadingSalons) {
    return (
      <div className="text-center py-10">
        <div className="animate-spin h-10 w-10 border-b-2 border-gray-900 rounded-full"></div>
        <p className="mt-4 text-sm">Loading salon data...</p>
      </div>
    );
  }

  if (!SalonData) {
    return <div className="text-center py-10">No salons found.</div>;
  }
  console.log(SalonData)

  if (LoadingCategoriesSalons) {
    return (
      <div className="text-center py-10">
        <div className="animate-spin h-10 w-10 border-b-2 border-gray-900 rounded-full"></div>
        <p className="mt-4 text-sm">Loading salon categories...</p>
      </div>
    );
  }

  // if (!SalonCategoriesData || SalonCategoriesData.length === 0) {
  //   return <div className="text-center py-10">No categories found for this salon.</div>;
  // }

  

  return (
    <div className="container mx-auto p-6 bg-white rounded-lg shadow-lg">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-semibold">{SalonData.name}</h1>
        <div className="flex items-center space-x-2">
          <Switch
            {...register("salonVerification")}
            checked={acceptMessages}
            onCheckedChange={handleSwitchChange}
            disabled={isSwitchLoading}
          />
          <span className="text-sm">
            {acceptMessages ? "Revoke Verification" : "Verify"}
          </span>
          {isSwitchLoading && (
            <div className="ml-2 animate-spin h-4 w-4 border-b-2 border-gray-900 rounded-full"></div>
          )}
        </div>
      </div>

      {/* Salon Details */}
      
      <Table className="min-w-full mb-8">
        <TableBody>
          <TableRow>
            <TableHead>Address</TableHead>
            <TableCell>{SalonData.address}</TableCell>
          </TableRow>
          <TableRow>
            <TableHead>City</TableHead>
            <TableCell>{SalonData.city}</TableCell>
          </TableRow>
          <TableRow>
            <TableHead>State</TableHead>
            <TableCell>{SalonData.state}</TableCell>
          </TableRow>
          <TableRow>
            <TableHead>Country</TableHead>
            <TableCell>{SalonData.country}</TableCell>
          </TableRow>
          <TableRow>
            <TableHead>Pincode</TableHead>
            <TableCell>{SalonData.pincode}</TableCell>
          </TableRow>
          <TableRow>
            <TableHead>Verification</TableHead>
            <TableCell>
              <Badge variant={isVerifiedSalonStatus ? "default" : "destructive"}>
                {isVerifiedSalonStatus ? "Verified" : "Not Verified"}
              </Badge>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>

      {/* Bookings Section */}
      <h2 className="text-2xl font-semibold mb-4">Bookings</h2>
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {bookings ? bookings?.map((booking) => (
          <BookingCard key={booking.id} booking={booking} />
        )) : <div className="text-center py-10">No Bookings found for this salon.</div>}
      </div>

      <h1 className="text-3xl font-bold mb-6">Services</h1>


      
      {SalonCategoriesData ? <div> 
        <Tabs defaultValue={SalonCategoriesData[0]?.name || ""} className="w-full" >
        <TabsList>
          {SalonCategoriesData.map((category) => (
            <TabsTrigger key={category.name} value={category.name}>
              {category.name}
            </TabsTrigger>
          ))}
        </TabsList>
        

        {SalonCategoriesData.map((category) => (
          <TabsContent key={category.name} value={category.name}>
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mt-4">
              {category.services.map((service) => (
                <ServiceCard
                  key={service.id}
                  serviceName={service.serviceName}
                  description={service.description}
                  price={service.price}
                  discount={service.discount}
                  image={service.image}
                />
              ))}
            </div>
          </TabsContent>
          
        ))} </Tabs></div>: <div className="text-center py-10">No categories found for this salon.</div>}
      

      {/* {SalonCategoriesData ? SalonCategoriesData.map((category) => (
        <div key={category.name} className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">{category.name}</h2>
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {category.services.map((service) => (
              <ServiceCard
                key={service.id}
                serviceName={service.serviceName}
                description={service.description}
                price={service.price}
                discount={service.discount}
                image={service.image}
              />
            ))}
          </div>
        </div>
      )) : <div className="text-center py-10">No categories found for this salon.</div>} */}
    </div>

   
  );
};

export default Page;




// "use client";

// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableRow,
// } from "@/components/ui/table";
// import { Badge } from "@/components/ui/badge";
// import { Switch } from "@/components/ui/switch";
// import { useEffect, useState } from "react";
// import { useParams } from "next/navigation";
// import { zodResolver } from "@hookform/resolvers/zod";
// import {
//   fetchBookingsBySalonCode,
//   fetchSalonById,
//   fetchSalonVerificationStatus,
//   toggleSalonVerificationStatus,
// } from "@/utils/firebaseAuth";
// import { useForm } from "react-hook-form";
// import { SalonVerificationSchema } from "@/schemas/VerfiySalonSchema";
// import { BookingCard } from "./BookingCards";
// import { BookingType } from "@/types/BookingDataType";
// import { SalonDataType } from "@/types/SalonDataType";

// const Page = () => {
//   const [loadingSalons, setLoadingSalons] = useState(true);
//   const [isSwitchLoading, setIsSwitchLoading] = useState(false);
//   const [SalonData, setSalonData] = useState<SalonDataType | null>(null);
//   const [isVerifiedSalonStatus, setIsVerifiedSalonStatus] = useState<boolean | null>(false);
//   const [bookings, setBookings] = useState<BookingType[] | null>(null);

//   const { register, watch, setValue } = useForm({
//     resolver: zodResolver(SalonVerificationSchema),
//   });

//   const params = useParams();
//   const acceptMessages = watch("salonVerification");

//   // Fetch salon data by ID
//   useEffect(() => {
//     const fetchSalonData = async () => {
//       setLoadingSalons(true);
//       const data = await fetchSalonById(params.salonId as string);
//       const Bookingdata = await fetchBookingsBySalonCode(data?.salonCode as string);
//       setIsVerifiedSalonStatus(data?.isverified as boolean);
//       setBookings(Bookingdata);
//       setSalonData(data);
//       setLoadingSalons(false);
//     };
//     fetchSalonData();
//   }, [params.salonId]);

//   // Fetch initial verification status
//   useEffect(() => {
//     const fetchVerificationStatus = async () => {
//       setIsSwitchLoading(true);
//       try {
//         const status = await fetchSalonVerificationStatus(params.salonId as string);
//         setValue("salonVerification", status);
//         setIsVerifiedSalonStatus(status);
//       } catch (error) {
//         console.error(error);
//       } finally {
//         setIsSwitchLoading(false);
//       }
//     };
//     if (params.salonId) {
//       fetchVerificationStatus();
//     }
//   }, [params.salonId, setValue]);

//   const handleSwitchChange = async () => {
//     setIsSwitchLoading(true);
//     try {
//       const newStatus = await toggleSalonVerificationStatus(params.salonId as string);
//       setValue("salonVerification", newStatus);
//     } catch (error) {
//       console.error("Error toggling verification status:", error);
//     } finally {
//       setIsSwitchLoading(false);
//     }
//   };

//   if (loadingSalons) {
//     return (
//       <div className="text-center py-10">
//         <div className="animate-spin h-10 w-10 border-b-2 border-gray-900 rounded-full"></div>
//         <p className="mt-4 text-sm">Loading salon data...</p>
//       </div>
//     );
//   }

//   if (!SalonData) {
//     return <div className="text-center py-10">No salons found.</div>;
//   }

//   return (
//     <div className="container mx-auto p-6 bg-white rounded-lg shadow-lg">
//       {/* Header Section */}
//       <div className="flex justify-between items-center mb-8">
//         <h1 className="text-3xl font-semibold">{SalonData.name}</h1>
//         <div className="flex items-center space-x-2">
//           <Switch
//             {...register("salonVerification")}
//             checked={acceptMessages}
//             onCheckedChange={handleSwitchChange}
//             disabled={isSwitchLoading}
//           />
//           <span className="text-sm">
//             {acceptMessages ? "Revoke Verification" : "Verify"}
//           </span>
//           {isSwitchLoading && (
//             <div className="ml-2 animate-spin h-4 w-4 border-b-2 border-gray-900 rounded-full"></div>
//           )}
//         </div>
//       </div>

//       {/* Salon Details */}
//       <Table className="min-w-full mb-8">
//         <TableBody>
//           {Object.entries(SalonData).map(([key, value]) => (
//             <TableRow key={key}>
//               <TableHead className="capitalize">{key}</TableHead>
//               <TableCell>
//                 {Array.isArray(value)
//                   ? value.length > 0
//                     ? value.join(", ")
//                     : "N/A"
//                   : value || "N/A"}
//               </TableCell>
//             </TableRow>
//           ))}
//           <TableRow>
//             <TableHead>Verification</TableHead>
//             <TableCell>
//               <Badge variant={isVerifiedSalonStatus ? "default" : "destructive"}>
//                 {isVerifiedSalonStatus ? "Verified" : "Not Verified"}
//               </Badge>
//             </TableCell>
//           </TableRow>
//         </TableBody>
//       </Table>

//       {/* Bookings Section */}
//       <h2 className="text-2xl font-semibold mb-4">Bookings</h2>
//       <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
//         {bookings?.map((booking) => (
//           <BookingCard key={booking.id} booking={booking} />
//         ))}
//       </div>
//     </div>
//   );
// };

// export default Page;
