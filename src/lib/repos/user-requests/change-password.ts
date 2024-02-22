type ChangePasswordPayload = {
  oldPassword: string;
  newPassword: string;
};

export async function changePassword({
  oldPassword,
  newPassword,
}: ChangePasswordPayload) {
  const response = await fetch(`/api/user/change-password`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      oldPassword,
      newPassword,
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
