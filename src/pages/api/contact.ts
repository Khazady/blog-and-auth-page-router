import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase, insertDocument } from "@/lib/server/database";

type ResponseData = {
  message: string;
};

export default async function handler(
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

    let client;
    try {
      client = await connectToDatabase();
    } catch (error) {
      response.status(500).json({ message: "Connection to database failed" });
      return;
    }
    let result;
    try {
      result = await insertDocument(client, "messages", newMessage);
    } catch (error) {
      response.status(500).json({ message: "Inserting data failed" });
      return;
    }

    const savedMessage = { ...newMessage, id: result.insertedId };
    // savedMessage doesn't need to be returned to the client, sent it via email or show on admin panel

    response.status(201).json({ message: "Successfully stored message." });
  }
}
