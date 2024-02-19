import styles from "./contact-form.module.css";
import { FormEvent, useState } from "react";
import { createMessage } from "@/lib/api-requests/post";

export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  async function sendMessageHandler(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    //add client-side validation, e.g zod

    //replace fetch with useSWR/React-query
    await createMessage({ email, name, message });
    setName("");
    setEmail("");
    setMessage("");
  }
  return (
    <section className={styles.contact}>
      <h1>how can i help</h1>
      <form className={styles.form} onSubmit={sendMessageHandler}>
        <div className={styles.controls}>
          <div className={styles.control}>
            <label htmlFor="email">Your Email</label>
            <input
              type="email"
              name="email"
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
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </div>
        <div className={styles.actions}>
          <button>Send</button>
        </div>
      </form>
    </section>
  );
}
