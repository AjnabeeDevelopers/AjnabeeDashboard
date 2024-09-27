import * as React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge"; // Import for showing status badges

import { BookingType } from "@/types/BookingDataType"; // Your booking type interface

// BookingCard component to display booking details
export function BookingCard({ booking }: { booking: BookingType }) {
  return (
    <Card className=" p-4">
      <CardHeader>
        <CardTitle>{booking.username || "User"} </CardTitle>
        {/* <CardDescription>{booking.salonAddress}</CardDescription> */}
      </CardHeader>
      <CardContent>
        <div className="grid w-full gap-4">
          <div className="flex flex-col space-y-1.5">
            <Label>Booking Date</Label>
            <p>{booking.bookingDate}</p>
          </div>
          <div className="flex flex-col space-y-1.5">
            <Label>Booking Time</Label>
            <p>{booking.bookingTime}</p>
          </div>
          <div className="flex flex-col space-y-1.5">
            <Label>Booking Notes</Label>
            <p>{booking.notes || "No Notes present for this booking"}</p>
          </div>
          <div className="flex flex-col space-y-1.5">
            <Label>Booking Reschedule ?</Label>
            <p>{booking.rescheduleCount===0 ? "Not Rescheduled" : "Rescheduled"}</p>
          </div>
          <div className="flex gap-4">
            <Label>Service Status</Label>
            <Badge variant={booking.serviceStatus === "awaiting" ? "destructive" : "default"}>
              {booking.serviceStatus}
            </Badge>
          </div>
          <div className="flex gap-4">
            <Label>Booking Status</Label>
            <Badge variant={booking.status === "awaiting" ? "destructive" : "default"}>
              {booking.serviceStatus}
            </Badge>
          </div>
          <div className="flex flex-col space-y-1.5">
            <Label>Services</Label>
            {booking.services.map((service, index) => (
              <div key={index}>
                <p>{service.serviceName} - ₹{service.price}</p>
              </div>
            ))}
          </div>
          <div className="flex flex-col space-y-1.5">
            <Label>Total Price</Label>
            <p>₹{booking.totalPrice}</p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
      </CardFooter>
    </Card>
  );
}
