import { NextApiRequest, NextApiResponse } from "next";

type ResponseData = {
  message: string;
};

export default function handler(
  request: NextApiRequest,
  response: NextApiResponse<ResponseData>,
) {
  if (request.method === "POST") {
    const { email, name, message } = request.body;

    if (
      !email ||
      !email.includes("@") ||
      !name ||
      name.trim() === "" ||
      !message ||
      message.trim() === ""
    ) {
      response.status(422).json({
        message: "Invalid input.",
      });
      return;
    }

    const newMessage = {
      email,
      name,
      message,
    };
    //todo: store in db
    response.status(201).json({ message: "Successfully stored message." });
  }
}
