"use client";

import type React from "react";
import { type Dispatch, type SetStateAction, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Separator } from "@/components/ui/separator";
import useMediaQuery, { breakpoints } from "@/lib/hooks/use-media-query";
import { cn } from "@/lib/utils";

type DialogWrapperProps = {
  title?: React.ReactNode;
  description?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
  headerClassName?: string;
  footerClassName?: string;
  open?: boolean;
  setOpen?: Dispatch<SetStateAction<boolean>>;
  onOpenChange?: (open: boolean) => void;
  trigger?: React.ReactNode;
  defaultOpen?: boolean;
  breakpoint?: "small" | "medium" | "large" | "xLarge";
  handleOnly?: boolean;
  noDrawer?: boolean;
};

export default function DialogWrapper({
  title,
  description,
  children,
  footer,
  className = "",
  headerClassName,
  footerClassName,
  open,
  setOpen,
  onOpenChange,
  trigger,
  defaultOpen = false,
  breakpoint = "small",
  handleOnly = false,
  noDrawer = false,
}: DialogWrapperProps) {
  const isBreakpoint = useMediaQuery(breakpoints[breakpoint]);

  // Internal state for uncontrolled mode
  const [internalOpen, setInternalOpen] = useState(defaultOpen);

  // Determine if component is in controlled or uncontrolled mode
  const isControlled = open !== undefined && setOpen !== undefined;
  const isOpen = isControlled ? open : internalOpen;

  const handleOpenChange = (newOpen: boolean) => {
    // Call the external onOpenChange callback if provided
    onOpenChange?.(newOpen);

    // Update internal state (controlled or uncontrolled)
    if (isControlled) {
      setOpen(newOpen);
    } else {
      setInternalOpen(newOpen);
    }
  };

  if (isBreakpoint && !noDrawer) {
    return (
      <Drawer
        open={isOpen}
        onOpenChange={handleOpenChange}
        handleOnly={handleOnly}
        modal={false}
      >
        {trigger && (
          <DrawerTrigger className="cursor-pointer" asChild>
            {trigger}
          </DrawerTrigger>
        )}
        <DrawerContent
          className={cn(
            "pb-3 px-3 bg-secondary",
            "w-full min-h-[85vh] max-h-[85vh]",
            className,
          )}
        >
          <DrawerHeader
            className={cn(
              title || description
                ? "border-b bg-background/95 backdrop-blur h-fit"
                : "p-0",
              "bg-secondary",
              headerClassName,
            )}
          >
            <DrawerTitle className="text-xl font-semibold">{title}</DrawerTitle>
            <DrawerDescription className="text-sm text-muted-foreground mt-1">
              {description}
            </DrawerDescription>
          </DrawerHeader>
          {children}
          {footer && (
            <>
              <Separator />
              <DrawerFooter className={cn(footerClassName)}>
                {footer}
              </DrawerFooter>
            </>
          )}
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      {trigger && (
        <DialogTrigger className="cursor-pointer" asChild>
          {trigger}
        </DialogTrigger>
      )}
      <DialogContent className={cn("w-full bg-secondary", className)}>
        <DialogHeader
          className={cn(
            (title || description) &&
              "border-b bg-background/95 backdrop-blur h-fit",
            "bg-secondary",
            headerClassName,
          )}
        >
          <DialogTitle className="text-xl font-semibold">{title}</DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground mt-1">
            {description}
          </DialogDescription>
        </DialogHeader>
        {children}
        {footer && (
          <>
            <Separator />
            <DialogFooter className={cn(footerClassName)}>
              {footer}
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
