// Define the type for individual services in the booking
export interface ServiceType {
    id: string;
    description: string;
    image: string;
    price: number;
    serviceName: string;
    status: string;
    discount: number;
    totalPrice: number;
  }
  
  // Define the main type for the booking data
  export interface BookingType {
    bookingDate: string; // Date of the booking as a string
    bookingTime: string; // Time of the booking as a string
    id: string; // Booking ID
    notes: string; // Notes about the booking, can be empty
    rescheduleCount: number; // Number of times the booking was rescheduled
    salonAddress: string; // Address of the salon
    salonCode: string; // Unique salon code
    salonName: string; // Name of the salon
    serviceStatus: string; // Status of the service
    services: ServiceType[]; // Array of services
    description: string; // Description of the service (can be empty)
    discount: number; // Discount for the booking
    image: string; // Image URL
    price: number; // Price of the service
    serviceName: string; // Name of the service
    status: string; // Status of the booking (e.g., "pending")
    totalPrice: number; // Total price for the booking
    uid: string; // User ID
    username: string; // Name of the user
  }