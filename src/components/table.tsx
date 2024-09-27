// "use client";

// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";

// import {
//   useReactTable,
//   getCoreRowModel,
//   flexRender,
//   getPaginationRowModel,
//   getSortedRowModel,
//   getFilteredRowModel,
//   ColumnDef,
//   SortingState,
// } from "@tanstack/react-table";
// import {
//   Select,
//   SelectContent,
//   SelectGroup,
//   SelectItem,
//   SelectLabel,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select"
// import { Checkbox } from "@/components/ui/checkbox"
// import { useEffect, useState } from "react";
// import moment from "moment";
// import { IPaper } from "@/model/PaperSchema";
// import { Button } from "@/components/ui/button";
// import { Download } from "lucide-react";
// import { ArrowUpDown, MoreHorizontal } from "lucide-react"
// import { Input } from "../../../../../components/ui/input";
// import Link from "next/link";
// // import PaperDetailsPage from "./PaperDetailsPage";
// import { usePathname, useRouter } from "next/navigation";
// import { SubmittedPaper } from "@/types/SubmittedPaperType";
// import { DeletePapers } from "./DeletePapers";
// import { DownloadPapers } from "./DownloadBulkPapers";
// import { useForm } from "react-hook-form";

// interface PaperTableProps {
//   data: SubmittedPaper[];
// }

// const PaperTable: React.FC<PaperTableProps> = ({ data }) => {
//   const router = useRouter()
//   const pathname=usePathname()


//   const DownloadFile = (file: string) => {
//     try {
//       fetch(file)
//         .then((res) => res.blob())
//         .then((blob) => {
//           const url = window.URL.createObjectURL(blob);
//           const a = document.createElement("a");
//           a.style.display = "none";
//           a.href = url;
//           const nameSplit = file.split("/").pop();
//           a.download = nameSplit ?? "download";
//           document.body.appendChild(a);
//           a.click();
//           window.URL.revokeObjectURL(url);
//         })
//         .catch((error) => console.log("error while downloading the file", error.message));
//     } catch (error: any) {
//       console.log("error while downloading the file", error.message);
//     }
//   };

//   const getAuthorNames=(row:SubmittedPaper)=>{
//     const authors = [
//       ...row.paperAuthor.map((author: any) => author.fullname),
//       ...row.correspondingAuthor.map((author: any) => author.fullname),
//     ];
//     const uniqueAuthors = Array.from(new Set(authors));
//     return uniqueAuthors.join(", ");
//   }

//   const [sorting, setSorting] = useState<SortingState>([]);
//   const [filtering, setFiltering] = useState("");
//   const [rowSelection, setRowSelection] = useState({})
//   const [pagination, setPagination] = useState({
//     pageIndex: 0, //initial page index
//     pageSize: 10, //default page size
//   });
//   const [NoOfPaper, setNoOfPaper] = useState<number>(10)

//   const columns: ColumnDef<SubmittedPaper>[] =[
//     {
//       id: "select",
//       header: ({ table }) => (
//         <Checkbox
//           checked={
//             table.getIsAllPageRowsSelected() ||
//             (table.getIsSomePageRowsSelected() && "indeterminate")
//           }
//           onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
//           aria-label="Select all"
//         />
//       ),
//       cell: ({ row }) => (
//         <Checkbox
//           checked={row.getIsSelected()}
//           onCheckedChange={(value) => row.toggleSelected(!!value)}
//           aria-label="Select row"
//         />
//       ),
//       enableSorting: false,
//       enableHiding: false,
//     },
//       {
//         // header: "ID",
//         header: ({ column }) => {
//           return (
//             <Button
//               variant="ghost"
//               onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
//             >
//               ID
//               <ArrowUpDown className="ml-2 h-4 w-4" />
//             </Button>
//           )
//         },
//         accessorKey: "paperID",
//         cell: (id) => id.getValue<string>().split("-")[2],
//         footer: "ID",

//       },
//       {
//         header: "Authors",
//         accessorFn: (row) => getAuthorNames(row), //row.paperAuthor[0]?.fullname || ""
//         footer: "Author",
//       },
//       {
//         header: "Title",
//         accessorKey: "paperTitle",
//         footer: "Title",
//       },
//       {
//         header: "Information",
//         accessorFn: row=>row.paperID,
//         footer: "Information",
//         cell:info=>(
//           <Button variant={'outline'} onClick={()=>router.push(`${pathname}/${info.getValue()}`)}>Open</Button>
//         )
//       },
//       {
//         header: "Paper",
//         accessorKey: "paperFile",
//         cell: (info) => (
//           <Button variant={"ghost"} onClick={() => DownloadFile(info.getValue<string>())}>
//             <Download />
//           </Button>
//         ),
//         footer: "Paper",
//       },
//       {
//         header:({ column }) => {
//           return (
//             <Button
//               variant="ghost"
//               onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
//             >
//               Time
//               <ArrowUpDown className="ml-2 h-4 w-4" />
//             </Button>
//           )
//         },
//         accessorKey: "paperSubmissionDate",
//         footer: "Time",
//         cell: (info) => moment(info.getValue<string>()).format("MMMM Do YYYY, h:mm:ss a"),
//       },
//     ]


//     const handlePagination=(value:number)=>{
//       if(value==-1){
//         setPagination({
//           pageIndex: 0, //initial page index
//           pageSize: 10000, //default page size
//           })
//       }
//       setPagination({
//         pageIndex: 0, //initial page index
//         pageSize: value, //default page size
//         })
//     }

//   const table = useReactTable({
//     data,
//     columns,

//     getCoreRowModel: getCoreRowModel(),
//     getPaginationRowModel: getPaginationRowModel(),
//     onPaginationChange: setPagination,
//     getSortedRowModel: getSortedRowModel(),
//     onRowSelectionChange: setRowSelection,
//     getFilteredRowModel: getFilteredRowModel(),
//     state: {
//       pagination,
//       globalFilter: filtering,
//       sorting: sorting,
//       rowSelection,
//     },
//     onSortingChange: setSorting,
//     onGlobalFilterChange: setFiltering,
//     globalFilterFn:"includesString",
//   });

//   return (
//     <div>
//     <div className="flex  justify-between items-center py-4">
//       <Input
//         placeholder="Search.."
//         type="text"
//         value={filtering}
//         onChange={(e) => table.setGlobalFilter(String(e.target.value))}
//         className="max-w-60"
//       />
//       <div>Showing 
//       <div className="inline-block ">
//       <Select onValueChange={(value)=>(handlePagination(Number(value)),setNoOfPaper(Number(value)))}>
//       <SelectTrigger className="w-[50px] h-[30px] inline-block static  mx-2 my-0">
//         <SelectValue placeholder="V" className="font-extrabold" />
//       </SelectTrigger>
//       <SelectContent>
//         <SelectGroup>
//           <SelectLabel>No. of Papers</SelectLabel>
//           <SelectItem value="10">10</SelectItem>
//           <SelectItem value="20">20</SelectItem>
//           <SelectItem value="50">50</SelectItem>
//           <SelectItem value="100">100</SelectItem>
//           <SelectItem value="200">200</SelectItem>
//           <SelectItem value="500">500</SelectItem>
//           <SelectItem value="-1">all</SelectItem>
//         </SelectGroup>
//       </SelectContent>
//     </Select>
//     </div>
//         entries of {table.getFilteredRowModel().rows.length} (1 to {NoOfPaper})</div>
//       <div className="space-x-6">
//         <DeletePapers selectedRows={[...table.getFilteredSelectedRowModel().rows.map((row)=>row.original)]}/>
//         <DownloadPapers papers={[...table.getFilteredSelectedRowModel().rows.map((row)=>row.original)]}/>
//       </div>

//     </div>
//     <div className="rounded-md border">
//       <Table>
//         <TableHeader >
//           {table.getHeaderGroups().map((headerGroup) => (
//             <TableRow key={headerGroup.id}>
//               {headerGroup.headers.map((header) => {
//                 return (
//                   <TableHead key={header.id}>
//                     {header.isPlaceholder
//                       ? null
//                       : flexRender(header.column.columnDef.header, header.getContext())}
//                   </TableHead>
//                 );
//               })}
//             </TableRow>
//           ))}
//         </TableHeader>
//         <TableBody>
//           {table.getRowModel().rows?.length ? (
//             table.getRowModel().rows.map((row) => (
//               <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
//                 {row.getVisibleCells().map((cell) => (
//                   <TableCell key={cell.id}>
//                     {flexRender(cell.column.columnDef.cell, cell.getContext())}
//                   </TableCell>
//                 ))}
//               </TableRow>
//             ))
//           ) : (
//             <TableRow>
//               <TableCell colSpan={columns.length} className="h-24 text-center">
//                 No results.
//               </TableCell>
//             </TableRow>
//           )}
//         </TableBody>
//       </Table>

//       <div className="flex items-center justify-between space-x-2 py-4 px-4">
//       <div className="flex-1 text-sm text-muted-foreground">
        
//         {table.getFilteredSelectedRowModel().rows.length} of{" "}
//         {table.getFilteredRowModel().rows.length} row(s) selected.
//       </div>
//         <div>
//         <Button
//           variant="outline"
//           size="sm"
//           onClick={() => table.previousPage()}
//           disabled={!table.getCanPreviousPage()}
//         >
//           Previous
//         </Button>
//         <Button
//           variant="outline"
//           size="sm"
//           onClick={() => table.nextPage()}
//           disabled={!table.getCanNextPage()}
//         >
//           Next
//         </Button>
//         </div>
//       </div>
//     </div>
//     </div>
//   );
// };



// export default PaperTable;
"use client"
 
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table"
 
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "./ui/button"
import { usePathname, useRouter } from "next/navigation"

type Salon = {
  id: string,
  name: string,
  ownerIdentificationProofUrl: string,
  agreementDocumentUrl: null | string,
  address: string,
  city: string,
  country: string,
  isverified: boolean,
}

interface SalonProps {
  data: Salon[]
}

export function SalonTable({
  data
}:SalonProps) {
    console.log("in the table component")
    console.log(data)
    const router=useRouter()
const pathname=usePathname()
console.log(pathname)

 const columns: ColumnDef<Salon, any>[] = [
  {
    accessorKey: "name",
    header: "Salon Name",
  },
  {
    accessorKey: "ownerIdentificationProofUrl",
    header: "Owner ID Proof",
    cell: ({ row }) => (
      <a href={row.original.ownerIdentificationProofUrl} target="_blank" rel="noopener noreferrer">
        View ID Proof
      </a>
    ),
  },
  {
    accessorKey: "agreementDocumentUrl",
    header: "Agreement Document",
    cell: ({ row }) => (
      row.original.agreementDocumentUrl ? (
        <a href={row.original.agreementDocumentUrl} target="_blank" rel="noopener noreferrer">
          View Agreement
        </a>
      ) : (
        "No Agreement"
      )
    ),
  },
  {
    accessorKey: "address",
    header: "Address",
  },
  {
    accessorKey: "city",
    header: "City",
  },
  {
    accessorKey: "country",
    header: "Country",
  },
  {
    accessorKey: "isverified",
    header: "Verified",
    cell: ({ row }) => (
      row.original.isverified ? "Yes" : "No"
    ),
  },
  {
    header: "Open",
    accessorFn: row => row.id,
    cell: info => (
      <Button 
        variant={'outline'} 
        onClick={() => {
          const newPath = `/${info.getValue()}`; // Form the path
          router.push(newPath); // Push to new path
        }}
      >
        Open
      </Button>
    )
  },
]
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })


  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                )
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}