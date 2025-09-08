import { NotificationPartialType } from "@/store/notification-context";
import { SafeParseReturnType } from "zod";

export function removeFileExtension(filename: string): string {
  return filename.split(".")[0];
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
