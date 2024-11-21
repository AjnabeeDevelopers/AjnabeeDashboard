import { SalonDataType } from "@/types/SalonDataType";
import {firebaseConfig} from "./config"
import { initializeApp } from "firebase/app";
import {  collection, doc, getDoc, getDocs, getFirestore, query, updateDoc, where } from "firebase/firestore";
import { BookingType } from "@/types/BookingDataType";
import { salonCategoryType } from "@/types/SalonCategoryDatatype";
// import moment from "moment";

const FirebaseApp = initializeApp(firebaseConfig);
const firestore=getFirestore(FirebaseApp)

export const salonDataFetching = async ():Promise<SalonDataType[] | null> => {
    try {
      const salondocs = await getDocs(collection(firestore, 'SalonList'));
      const salonObjects = salondocs.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      console.log(salonObjects);
      return salonObjects as SalonDataType[]
    } catch (error) {
      console.log("Error fetching salon data", error);
      return null
    }
  };


  export const fetchSalonById = async (id:string):Promise<SalonDataType | null> => {
    try {
      const salonDocRef = doc(firestore, 'SalonList', id); // Reference to the specific salon document
      const salonDoc = await getDoc(salonDocRef); // Fetch the document
  
      if (salonDoc.exists()) {
        console.log("Salon data:", salonDoc.data());
        return { id: salonDoc.id , ...salonDoc.data() } as SalonDataType; // Return the salon data with the document ID
      } else {
        console.log("No such document!");
        return null; // Return null if no document is found
      }
    } catch (error) {
      console.error("Error fetching salon by ID:", error);
      return null
    }
  };


export const fetchAllCategoriesBySalonId = async (salonId: string): Promise<salonCategoryType[] | null> => {
  try {
    const categoriesCollectionRef = collection(firestore, 'SalonList', salonId, 'categories'); // Reference to the 'categories' subcollection
    const categoriesQuery = query(categoriesCollectionRef); // Create a query for the subcollection
    const querySnapshot = await getDocs(categoriesQuery); // Fetch all documents in the subcollection

    if (!querySnapshot.empty) {
      const categories: salonCategoryType[] = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data() as salonCategoryType
      }) as salonCategoryType);
      console.log("Categories data:", categories);
      return categories; // Return the list of categories
    } else {
      console.log("No categories found!");
      return null; // Return null if no documents found
    }
  } catch (error) {
    console.error("Error fetching categories by Salon ID:", error);
    return null;
  }
};


  export const fetchSalonVerificationStatus = async (id: string): Promise<boolean | null> => {
    try {
      const salonDocRef = doc(firestore, 'SalonList', id); // Reference to the specific salon document
      const salonDoc = await getDoc(salonDocRef); // Fetch the document
  
      if (salonDoc.exists()) {
        const salonData = salonDoc.data();
        console.log("Salon verification status:", salonData?.isverified);
        return salonData?.isverified || false; // Return the verification status or false if not verified
      } else {
        console.log("No such document!");
        return null; // Return null if no document is found
      }
    } catch (error) {
      console.error("Error fetching salon verification status:", error);
      return null;
    }
  };
  

  export const toggleSalonVerificationStatus = async (id: string): Promise<boolean | null> => {
    try {
      const salonDocRef = doc(firestore, 'SalonList', id); // Reference to the specific salon document
      const salonDoc = await getDoc(salonDocRef); // Fetch the document
  
      if (salonDoc.exists()) {
        const salonData = salonDoc.data();
        const currentStatus = salonData?.isverified || false; // Get the current verification status
        
        // Toggle the status
        const newStatus = !currentStatus;
        
        // Update the document with the new status
        await updateDoc(salonDocRef, { isverified: newStatus });
        console.log(`Salon verification status updated to: ${newStatus}`);
        
        return newStatus; // Return the new status
      } else {
        console.log("No such document!");
        return null; // Return null if no document is found
      }
    } catch (error) {
      console.error("Error toggling salon verification status:", error);
      return null;
    }
  };
  
export const fetchBookingsBySalonCode = async (salonCode: string): Promise<BookingType[] | null> => {
  try {
    console.log("salon code"+salonCode)
    const bookingsCollectionRef = collection(firestore, "Bookings"); // Reference to the "Bookings" collection
    console.log("in fetchBookingsBySalonCode")
    console.log(bookingsCollectionRef)
    const bookingsQuery = query(bookingsCollectionRef, where("salonCode", "==", salonCode)); // Query to match the salonCode
    console.log(bookingsQuery)

    const querySnapshot = await getDocs(bookingsQuery); // Execute the query

    const bookings: BookingType[] = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as BookingType[]; // Map the documents to an array of BookingDataType

    console.log(bookings); // Log the bookings to verify
    return bookings; // Return the array of bookings
  } catch (error) {
    console.error("Error fetching bookings by salon code:", error);
    return null; // Return null in case of an error
  }
};
