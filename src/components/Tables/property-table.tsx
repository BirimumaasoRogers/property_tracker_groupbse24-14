"use client";

import { useState, useId } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { PlusIcon, ChevronUpIcon, ChevronDownIcon } from "lucide-react";

// Dummy Data
const dummyData = [
  {
    id: "1",
    itemName: "Laptop",
    gpsTagStatus: "Active",
    propertyStatus: "In",
    geofenceCoordinates: "12.345, -98.765",
    geofenceShape: "Circle",
    geofenceCreatedAt: "2025-02-25 10:00:00",
    geofenceUpdatedAt: "2025-02-26 14:30:00",
  },
  {
    id: "2",
    itemName: "Phone",
    gpsTagStatus: "Inactive",
    propertyStatus: "In",
    geofenceCoordinates: "34.567, -76.543",
    geofenceShape: "Rectangle",
    geofenceCreatedAt: "2025-02-20 08:45:00",
    geofenceUpdatedAt: "2025-02-25 11:00:00",
  },
  {
    id: "3",
    itemName: "Tablet",
    gpsTagStatus: "Active",
    propertyStatus: "Out",
    geofenceCoordinates: "23.456, -87.654",
    geofenceShape: "Square",
    geofenceCreatedAt: "2025-01-30 09:20:00",
    geofenceUpdatedAt: "2025-02-20 16:15:00",
  },
  {
    id: "4",
    itemName: "Bag",
    gpsTagStatus: "Pending",
    propertyStatus: "In",
    geofenceCoordinates: "23.456, -87.654",
    geofenceShape: "Triangle",
    geofenceCreatedAt: "2025-02-10 012:20:00",
    geofenceUpdatedAt: "2025-02-10 13:15:00",
  },
];

const columns = [
  { header: "Item Name", accessorKey: "itemName" },
  { header: "GPS Tag Status", accessorKey: "gpsTagStatus" },
  { header: "Property Status", accessorKey: "propertyStatus" },
  { header: "Geofence Coordinates", accessorKey: "geofenceCoordinates" },
  { header: "Geofence Shape", accessorKey: "geofenceShape" },
  { header: "Created At", accessorKey: "geofenceCreatedAt" },
  { header: "Updated At", accessorKey: "geofenceUpdatedAt" },
];

export default function PropertyTrackingTable() {
  const id = useId();
  const [data, setData] = useState(dummyData);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="p-6 bg-white shadow-lg rounded-2xl">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Property Table</h2>
        <Button className="bg-green-400 hover:bg-green-500 text-white">
          <PlusIcon size={16} className="mr-2" /> Add Item
        </Button>
      </div>
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id} className="bg-gray-100">
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id} className="px-4 py-2">
                  <div
                    className="flex items-center cursor-pointer"
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    {flexRender(header.column.columnDef.header, header.getContext())}
                    {header.column.getIsSorted() === "asc" ? (
                      <ChevronUpIcon size={16} className="ml-2" />
                    ) : header.column.getIsSorted() === "desc" ? (
                      <ChevronDownIcon size={16} className="ml-2" />
                    ) : null}
                  </div>
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id} className="hover:bg-gray-50">
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id} className="px-4 py-2">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="text-center py-4">
                No items found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
