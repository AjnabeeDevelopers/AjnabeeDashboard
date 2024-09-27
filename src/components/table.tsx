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

 const columns: ColumnDef<Salon>[] = [
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
