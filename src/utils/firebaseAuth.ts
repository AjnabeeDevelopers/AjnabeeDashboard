import { SalonAdminDataType, SalonDataType } from "@/types/SalonDataType";
import {firebaseConfig} from "./config"
import { initializeApp } from "firebase/app";
import {  collection, deleteDoc, doc, getDoc, getDocs, getFirestore, query, updateDoc, where } from "firebase/firestore";
import { BookingType } from "@/types/BookingDataType";
import { salonCategoryType } from "@/types/SalonCategoryDatatype";
// import moment from "moment";

// import admin from "firebase-admin";

// Initialize the Admin SDK
// if (!admin.apps.length) {
//   admin.initializeApp({
//     credential: admin.credential.applicationDefault(), // Or specify the path to your service account key file
//   });
// }


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
  export const fetchSalonAdminDetailsById = async (id: string): Promise<SalonAdminDataType | null> => {
    try {
      // Reference to the SalonAdmin collection
      const salonAdminCollectionRef = collection(firestore, 'SalonAdmin');
  
      // Query to find a document where the uid matches the given id
      const salonQuery = query(salonAdminCollectionRef, where('uid', '==', id));
  
      // Execute the query
      const querySnapshot = await getDocs(salonQuery);
  
      // If a document is found, return the first match (if multiple documents can exist with the same uid, handle accordingly)
      if (!querySnapshot.empty) {
        const salonDoc = querySnapshot.docs[0];
        console.log('Salon Admin data:', salonDoc.data());
        return { id: salonDoc.id, ...salonDoc.data() } as SalonAdminDataType;
      } else {
        console.log('No document found with the given uid');
        return null;
      }
    } catch (error) {
      console.error('Error fetching salon by ID:', error);
      return null;
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


//****************************************delete function */

import { getStorage, ref, deleteObject } from "firebase/storage";

async function deleteImageFromUrl(imageUrl: string): Promise<{ success: boolean; message: string }> {
  try {
    // Extract the file path from the URL
    const pathStart = imageUrl.indexOf("/o/") + 3; // Start after '/o/'
    const pathEnd = imageUrl.indexOf("?"); // End before query params
    const filePath = decodeURIComponent(imageUrl.substring(pathStart, pathEnd));

    // Initialize Firebase Storage
    const storage = getStorage();
    const fileRef = ref(storage, filePath);

    // Delete the file
    await deleteObject(fileRef);
    console.log(`Deleted file at path: ${filePath}`);

    return {
      success: true,
      message: `File deleted successfully at path: ${filePath}`,
    };
  } catch (error: any) {
    console.error(`Error deleting file: ${error.message}`);
    return {
      success: false,
      message: `Failed to delete file: ${error.message}`,
    };
  }
}



export const deleteSalonData = async (salonId: string): Promise<{ message: string; success: boolean; status: number }> => {
  try {
    // Reference to the SalonList document
    const salonDocRef = doc(firestore, 'SalonList', salonId);
    const salonDoc = await getDoc(salonDocRef);

    if (!salonDoc.exists()) {
      return {
        message: `Salon with ID ${salonId} does not exist.`,
        success: false,
        status: 404,
      };
    }

    const salonData = salonDoc.data();
    console.log(salonData)
    const salonCode = salonData?.salonCode;
    const salonName = salonData?.name;

    if (!salonCode || !salonName) {
      return {
        message: "Missing salonCode or salonName in the SalonList document.",
        success: false,
        status: 400,
      };
    }

    // Step 1: Delete bookings with matching salonCode
    try {
      const bookingsQuery = query(
        collection(firestore, "Bookings"),
        where("salonCode", "==", salonCode)
      );
      const bookingsSnapshot = await getDocs(bookingsQuery);
      await Promise.all(
        bookingsSnapshot.docs.map((doc) => deleteDoc(doc.ref))
      );
      console.log(`Deleted ${bookingsSnapshot.size} booking(s) for salonCode: ${salonCode}`);
    } catch (error:any) {
      return {
        message: `Error deleting bookings: ${error.message}`,
        success: false,
        status: 500,
      };
    }

    // // Step 2: Delete SalonAdmin document and Authentication User
    // try {
    //   const salonAdminDocRef = doc(firestore, "SalonAdmin", salonId);
    //   const salonAdminDoc = await getDoc(salonAdminDocRef);

    //   if (salonAdminDoc.exists()) {
    //     const salonAdminData = salonAdminDoc.data();
    //     const adminUid = salonAdminData?.uid;

    //     if (adminUid) {
    //       // Delete user from Firebase Authentication
    //       await admin.auth().deleteUser(adminUid);
    //       console.log(`Deleted Authentication user with UID: ${adminUid}`);
    //     }

    //     // Delete SalonAdmin document
    //     await deleteDoc(salonAdminDocRef);
    //     console.log(`Deleted SalonAdmin document with ID: ${salonId}`);
    //   }
    // } catch (error:any) {
    //   return {
    //     message: `Error deleting SalonAdmin document or Authentication user: ${error.message}`,
    //     success: false,
    //     status: 500,
    //   };
    // }

    // Step 3: Delete reviews with matching salonName
    try {
      const reviewsQuery = query(
        collection(firestore, "Reviews"),
        where("salonName", "==", salonName)
      );
      const reviewsSnapshot = await getDocs(reviewsQuery);
      await Promise.all(
        reviewsSnapshot.docs.map((doc) => deleteDoc(doc.ref))
      );
      console.log(`Deleted ${reviewsSnapshot.size} review(s) for salonName: ${salonName}`);
    } catch (error:any) {
      return {
        message: `Error deleting reviews: ${error.message}`,
        success: false,
        status: 500,
      };
    }
    
    // Step 5: Delete additional salon image
      const additionalSalonImageUrl = salonData?.additionalSalonImageUrl || "";
      const agreementDocumentUrl = salonData?.agreementDocumentUrl || "";
      const insideSalonImageUrl = salonData?.insideSalonImageUrl || "";
      const outsideSalonImageUrl = salonData?.outsideSalonImageUrl || "";
      const ownerIdentificationProofUrl = salonData?.ownerIdentificationProofUrl || "";
      const introductoryVideoUrl = salonData?.introductoryVideoUrl || "";
      
      
      // Array of URLs to delete
      const urlsToDelete = [
        additionalSalonImageUrl,
        agreementDocumentUrl,
        insideSalonImageUrl,
        outsideSalonImageUrl,
        ownerIdentificationProofUrl,
        introductoryVideoUrl
      ];
      
      // Track deletion results
      const deletionResults = await Promise.all(
        urlsToDelete
          .filter((url) => url) // Ensure no empty strings are passed
          .map(async (url) => {
            try {
              const result = await deleteImageFromUrl(url);
              if (!result.success) {
                console.error(`Failed to delete: ${url}`);
              }
              return result;
            } catch (error: any) {
              console.error(`Error deleting URL ${url}:`, error.message);
              return {
                success: false,
                message: `Failed to delete URL ${url}: ${error.message}`,
              };
            }
          })
      );
      
      // Handle any errors
      const failedDeletions = deletionResults.filter((res) => !res.success);
      
      if (failedDeletions.length > 0) {
        return {
          message: `Failed to delete some images/documents: ${failedDeletions.map((res) => res.message).join(", ")}`,
          success: false,
          status: 500,
        };
      }
      
      console.log("All files deleted successfully.");
      

    // Step 6: Delete categories subcollection
    try {
      const categoriesCollectionRef = collection(firestore, "SalonList", salonId, "categories");
      const categoriesSnapshot = await getDocs(categoriesCollectionRef);

      if (!categoriesSnapshot.empty) {
        await Promise.all(
          categoriesSnapshot.docs.map((doc) => deleteDoc(doc.ref))
        );
        console.log(`Deleted ${categoriesSnapshot.size} categories for salonId: ${salonId}`);
      } else {
        console.log(`No categories found for salonId: ${salonId}`);
      }
    } catch (error: any) {
      return {
        message: `Error deleting categories subcollection: ${error.message}`,
        success: false,
        status: 500,
      };
    }

    // Step 4: Delete the SalonList document
    try {
      await deleteDoc(salonDocRef);
      console.log(`Deleted SalonList document with ID: ${salonId}`);
    } catch (error:any) {
      return {
        message: `Error deleting SalonList document: ${error.message}`,
        success: false,
        status: 500,
      };
    }
    // All operations successful
    return {
      message: "Salon data deleted successfully, including authentication user.",
      success: true,
      status: 200,
    };
  } catch (error:any) {
    // Handle unexpected errors
    return {
      message: `Unexpected error: ${error.message}`,
      success: false,
      status: 500,
    };
  }
};



//****************************************delete function */