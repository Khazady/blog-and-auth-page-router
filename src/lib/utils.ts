import { NotificationPartialType } from "@/store/notification-context";
import { SafeParseReturnType } from "zod";

export function removeFileExtension(filename: string): string {
  const lastDotIndex = filename.lastIndexOf(".");
  if (lastDotIndex === -1) {
    // If there's no dot in the filename, return the filename as is
    return filename;
  } else {
    // Otherwise, return the filename without the extension
    return filename.substring(0, lastDotIndex);
  }
}

export function validateOrNotify<T>(
  result: SafeParseReturnType<unknown, T>,
  notify: (data: NotificationPartialType) => void,
): result is { success: true; data: T } {
  if (!result.success) {
    const firstError = result.error.errors[0]?.message || "Validation error";
    notify({ message: firstError });
    return false;
  }
  return true;
}
