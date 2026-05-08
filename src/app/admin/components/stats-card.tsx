"use client";

import { type ReactNode, useMemo } from "react";
import type { User } from "@/lib/db/schema";

interface StatCardProps {
  title: string;
  users: Partial<User>[];
  icon: ReactNode;
}

const StatCard: React.FC<StatCardProps> = ({ title, users, icon }) => {
  const anonymousCount = useMemo(() => {
    return users.filter((user) => user.isAnonymous).length;
  }, [users]);

  const registeredCount = useMemo(() => {
    return users.filter((user) => !user.isAnonymous).length;
  }, [users]);

  const ratio = useMemo(() => {
    return users.length > 0
      ? ((registeredCount / users.length) * 100).toFixed(1)
      : "0";
  }, [registeredCount, users]);

  return (
    <div className="bg-secondary flex items-center gap-4 p-4 border rounded-lg shadow-sm">
      <div className="flex items-center justify-center w-12 h-12 border rounded-full">
        <span className="text-2xl">{icon}</span>
      </div>
      <div>
        <p className="text-sm text-accent-foreground capitalize">{title}</p>
        <p className="text-2xl font-semibold">{users.length}</p>
        <div className="flex gap-3 mt-1 text-xs text-muted-foreground">
          <span>Registered: {registeredCount}</span>
          <span>Anonymous: {anonymousCount}</span>
          <span>Registration Ratio: {ratio}%</span>
        </div>
      </div>
    </div>
  );
};

export default StatCard;
