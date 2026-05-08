"use client";

import { useQuery } from "@tanstack/react-query";
import { User } from "lucide-react";
import StatCard from "@/app/admin/components/stats-card";
import { userTableColumns } from "@/app/admin/users/components/columns";
import AdminUsersSkeleton from "@/app/admin/users/skeleton";
import { DataTable } from "@/components/ui/data-table";
import { adminQueries } from "@/lib/queries/admin";

export default function UsersPage() {
  const { data: users, refetch, isLoading } = useQuery(adminQueries.users());

  if (isLoading) return <AdminUsersSkeleton />;

  if (!users) return null;

  return (
    <div className="flex flex-col gap-4 min-h-[80vh] pt-5">
      <StatCard title={"total users"} users={users} icon={<User />} />
      <DataTable
        hiddenColumns={["id", "isDonor"]}
        filters={["name", "email"]}
        columns={userTableColumns}
        data={users}
        refetch={refetch}
      />
    </div>
  );
}
