type serviceType={
    description:string,
    discount:number,
    id:string,
    image:string,
    price:number,
    serviceName:string
}
export interface salonCategoryType{
    name:string,
    services:serviceType[]
}