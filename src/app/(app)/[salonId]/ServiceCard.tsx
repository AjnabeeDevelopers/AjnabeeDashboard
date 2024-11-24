import React from "react";

interface ServiceCardProps {
  serviceName: string;
  description: string;
  price: number;
  discount: number;
  image: string;
}

const ServiceCard: React.FC<ServiceCardProps> = ({
  serviceName,
  description,
  price,
  discount,
  image,
}) => {
  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <img
        src={image}
        alt={serviceName}
        className="w-full h-40 object-cover rounded-md mb-4"
      />
      <h3 className="text-lg font-semibold mb-2">{serviceName}</h3>
      <p className="text-sm text-gray-600 mb-4">{description}</p>
      <div className="flex justify-between items-center">
        <p className="text-lg font-bold">₹{price - (price * discount) / 100}</p>
        {discount > 0 && (
          <span className="text-sm bg-green-100 text-green-600 py-1 px-2 rounded">
            {discount}% off
          </span>
        )}
      </div>
    </div>
  );
};

export default ServiceCard;
