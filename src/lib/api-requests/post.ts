import { MessageType } from "@/lib/types/message";

export async function createMessage({ email, message, name }: MessageType) {
  const response = await fetch(`/api/contact`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      message,
      name,
    }),
  });
  if (response.ok) {
    return response.json();
  } else {
    return response.json().then((error) => {
      throw new Error(error.message || "Something went wrong!");
    });
  }
}
