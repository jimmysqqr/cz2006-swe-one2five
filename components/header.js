import { useRouter } from 'next/router'
import Link from "next/link";
import Image from "next/image";
import styles from "./Header.module.scss";
import logo from "/public/logo.svg";

export default function Header() {
  // let activeTab = "fun";
  const router = useRouter();
  // let activeTab = router.asPath == "/"? "/" : router.asPath.slice(0,router.asPath.slice(1).indexOf("/")+1)
  let activeTab = router.asPath.slice(0, router.asPath.slice(1).indexOf("/") == -1? router.asPath.length:router.asPath.slice(1).indexOf("/")+1)
  let tabStyles = [{}, {}, {}]
  if (activeTab == "/" || activeTab == "/lookup") {
    tabStyles[0] = styles.active;
  } else if (activeTab == "/search") {
    tabStyles[1] = styles.active;
  } else if (activeTab == "/compare") {
    tabStyles[2] = styles.active;
  }

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
            <a className={tabStyles[0]}>Lookup</a>
          </Link>
          <Link href="/search">
            <a className={tabStyles[1]}>Search</a>
          </Link>
          <Link href="/compare">
            <a className={tabStyles[2]}>Compare</a>
          </Link>
        </nav>
      </div>
    </header>
  );
}
