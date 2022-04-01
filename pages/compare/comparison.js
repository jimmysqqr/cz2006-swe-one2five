import Head from "next/head";
import Image from "next/image";

import Header from "/components/Header.js";
import bg from "/public/compare_bg.jpg";
import { CompareTable } from "/components/CompareTable";

export default function SideBySidePage() {
  return (
    <div className="pageContainer">
      <Head>
        <title>Rentigo - Lookup Results</title>
        <link rel="icon" href="/icon.png" />
      </Head>
      

      <div className="headerContainer">
        <Header />
      </div>

      <div className="mainContainer">
        <div className="bgContainer">
          <Image src={bg} layout="fill" objectFit="cover" alt="A picture of a group of flats from ground level" priority/>
        </div>
        <main>
          <div className="pageContentContainer">
            <CompareTable />
          </div>
        </main>
      </div>
    </div>
  );
}
