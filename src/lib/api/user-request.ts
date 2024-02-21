import { UserType } from "@/lib/types/user";

export async function createUser({ email, password }: UserType) {
  const response = await fetch(`/api/auth/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
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
