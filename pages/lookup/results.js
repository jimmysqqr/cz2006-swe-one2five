import Head from "next/head";
import Image from "next/image";

import Header from "/components/header.js";
import bg from "/public/lookup_bg.jpg";

export default function LookupPage() {

  return (
    <div className="pageContainer">
      <Head>
        <title>Rentigo - Lookup Results</title>
        <link rel="icon" href="icon.png" />
      </Head>

      <div className="headerContainer">
        <Header />
      </div>

      <div className="mainContainer">
        <div className="bgContainer">
          <Image src={bg} layout="fill" objectFit="cover" alt="A living room background" />
        </div>
        <main>
          <div className="pageTitleContainer">
            <div className="pageTitle">Punggol Street 25 Block 24</div>
            <div className="pageSubtitle">
            2-Room Flat
            </div>
          </div>
          <div className="pageContentContainer">
            
          </div>
        </main>
      </div>
    </div>
  );
}
