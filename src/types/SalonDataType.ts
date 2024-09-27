export interface SalonDataType {
    id: string; // Unique identifier for the salon
    name: string; // Name of the salon
    address: string; // Address of the salon
    city: string; // City where the salon is located
    state: string; // State where the salon is located
    country: string; // Country where the salon is located
    pincode: number; // Postal code
    description: string | null; // Description of the salon, can be null
    ownerIdentificationProofUrl: string; // URL to owner's ID proof
    agreementDocumentUrl: string | null; // URL to agreement document, can be null
    isverified: boolean; // Verification status of the salon
    isOpen: boolean; // Open status of the salon
    latitude: number; // Latitude of the salon's location
    longitude: number; // Longitude of the salon's location
    rating: number | null; // Rating of the salon, can be null
    salonCode: string; // Unique code for the salon
    additionalSalonImageUrl: string | null; // Additional image URL, can be null
    insideSalonImageUrl: string; // URL to inside salon images
    outsideSalonImageUrl: string; // URL to outside salon images
    breakHours: string[]; // Array of break hours
    categories: string[]; // Array of categories the salon falls into
    servicesList: string[]; // List of services offered by the salon
    workingDays: string[]; // Array of working days
    viewCount: number | null; // Count of views, can be null
    fcmToken: string; // FCM token for notifications
    closingHour: string; // Closing hour of the salon
    openingHour: string; // Opening hour of the salon
  }
