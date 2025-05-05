import { createMessage } from "@/lib/repos/message-request";
import { contactSchema } from "@/schemas/concactSchema";
import NotificationContext from "@/store/notification-context";
import { FormEvent, useContext, useState } from "react";
import styles from "./contact-form.module.css";

export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const {
    notification,
    showNotification,
    showSuccessNotification,
    showErrorNotification,
  } = useContext(NotificationContext);

  const isPending = notification?.status === "pending";

  async function sendMessageHandler(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const result = contactSchema.safeParse({ name, email, message });

    if (!result.success) {
      const firstError = result.error.errors[0]?.message;
      showErrorNotification({ message: firstError || "Validation error" });
      return;
    }

    showNotification({
      title: "Sending message...",
      message: "Your message is on it's way.",
      status: "pending",
    });

    try {
      await createMessage(result.data); //replace fetch with useSWR/React-query
      showSuccessNotification({
        message: "Your message has been sent successfully.",
      });
      setName("");
      setEmail("");
      setMessage("");
    } catch (error) {
      showErrorNotification({
        message: (error as Error).message || "Something went wrong.",
      });
    }
  }
  return (
    <section className={styles.contact}>
      <h1>How can I help you?</h1>
      <form className={styles.form} onSubmit={sendMessageHandler}>
        <div className={styles.controls}>
          <div className={styles.control}>
            <label htmlFor="email">Your Email</label>
            <input
              type="email"
              name="email"
              autoComplete="email"
              id="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className={styles.control}>
            <label htmlFor="name">Your Name</label>
            <input
              type="text"
              name="name"
              autoComplete="name"
              id="name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
        </div>
        <div className={styles.control}>
          <label htmlFor="message">Your Message</label>
          <textarea
            name="message"
            id="message"
            rows={5}
            required
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </div>
        <div className={styles.actions}>
          <button disabled={isPending}>
            {isPending ? "Sending..." : "Send"}
          </button>
        </div>
      </form>
    </section>
  );
}
