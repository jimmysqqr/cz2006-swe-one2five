import Link from "next/link";
import Image from "next/image";
import styles from "./Header.module.scss";
import logo from "/public/logo.svg";

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.logoLinkContainer}>
        <Link href="/">
          <a><Image src={logo} layout="fill" objectFit="contain" alt="rentigo"/></a>
        </Link>
      </div>
      <div className={styles.navContainer}>
        <nav>
          <Link href="/">
            <a>Lookup</a>
          </Link>
          <Link href="/search">
            <a>Search</a>
          </Link>
          <Link href="/compare">
            <a>Compare</a>
          </Link>
        </nav>
      </div>
    </header>
  );
}
