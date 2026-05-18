import Link from "next/link";
import styles from "./Logo.module.css";

export function Logo() {
  return (
    <Link href="/" aria-label="Forge — home" className={styles.logo}>
      <span aria-hidden="true">F</span>
    </Link>
  );
}
