import styles from "./contact-form.module.css";

export default function ContactForm() {
  return (
    <section className={styles.contact}>
      <h1>how can i help</h1>
      <form className={styles.form}>
        <div className={styles.controls}>
          <div className={styles.control}>
            <label htmlFor="email">Your Email</label>
            <input type="email" name="email" id="email" required />
          </div>
          <div className={styles.control}>
            <label htmlFor="name">Your Name</label>
            <input type="text" name="name" id="name" required />
          </div>
        </div>
        <div className={styles.control}>
          <label htmlFor="message">Your Message</label>
          <textarea name="message" id="message" rows={5} />
        </div>
        <div className={styles.actions}>
          <button>Send</button>
        </div>
      </form>
    </section>
  );
}
