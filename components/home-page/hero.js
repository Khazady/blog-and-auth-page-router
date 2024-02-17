import styles from "./hero.module.css";
import Image from "next/image";

export default function Hero() {
  return (
    <section className={styles.hero}>
      <div className={styles.image}>
        <Image src="/images/site/michael.jpg" alt="An image showing Michael" width={300} height={300}/>
      </div>
      <h1>Hi, I'm Michael!</h1>
      <p>This blog is about whatever comes in my head :)</p>
    </section>
  );
}
