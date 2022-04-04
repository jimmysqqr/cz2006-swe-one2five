import React, { useState, useEffect } from "react";

import { useRouter } from "next/router";
import Link from "next/link";
import Image from "next/image";
import styles from "./Header.module.scss";
import logo from "/public/logo.svg";
import { loadData } from "/components/data/httpRequestControl";

export default function Header(props) {
  // let activeTab = "fun";
  const router = useRouter();
  // let activeTab = router.asPath == "/"? "/" : router.asPath.slice(0,router.asPath.slice(1).indexOf("/")+1)
  let activeTab = router.asPath.slice(
    0,
    router.asPath.slice(1).indexOf("/") == -1 ? router.asPath.length : router.asPath.slice(1).indexOf("/") + 1
  );
  let tabStyles = [{}, {}, {}];
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
          <a>
            <Image src={logo} layout="fill" objectFit="contain" alt="rentigo" />
          </a>
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
            <a className={tabStyles[2]}>
              Compare <SavedFlatCounter uuid={props.uuid} isSaved={props.isSaved} savedFlats={props.savedFlats} />
            </a>
          </Link>
        </nav>
      </div>
    </header>
  );
}

function SavedFlatCounter(props) {
  const [savedFlatCounter, setSavedFlatCounter] = useState(0);

  let valueToDisplay = 0;
  let savedValue = props.isSaved ? 1 : 0;
  if (savedFlatCounter + savedValue) {
    valueToDisplay = savedFlatCounter + savedValue;
  }
  if (props.savedFlats) { // changes made on the client side take precedence over the api call when navigating to the current page
    valueToDisplay = props.savedFlats.length;
  }

  useEffect(() => {
    loadData(`/api/v1/savedFlats/${props.uuid}`, {})
      .then((res) => res.json())
      .then(
        (result) => {
          console.log("getAllSavedFlats for header", result);
          setSavedFlatCounter(result["found"]);
        },
        (error) => {
          console.log(error);
        }
      );
  }, [props.uuid]);

  return <>{valueToDisplay > 0 ? <div className={styles.savedFlatCounter}>{valueToDisplay}</div> : ""}</>;
}
