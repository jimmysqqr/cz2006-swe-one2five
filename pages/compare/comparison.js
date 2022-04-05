import React, { useState, useEffect } from "react";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from 'next/router'
import { v4 } from "uuid";

import { useLocalStorage } from "/components/data/localStorageControl";
import { loadData, postData } from "/components/data/httpRequestControl";
import Header from "/components/Header.js";
import bg from "/public/compare_bg.jpg";
import { CompareTable } from "/components/CompareTable";

export default function SideBySidePage() {
  const router = useRouter();
  console.log(router.query);

  const [uuid, setUuid] = useLocalStorage("uuid", v4());


  return (
    <div className="pageContainer">
      <Head>
        <title>Rentigo - Lookup Results</title>
        <link rel="icon" href="/icon.png" />
      </Head>
      

      <div className="headerContainer">
        <Header uuid={uuid}/>
      </div>

      <div className="mainContainer">
        <div className="bgContainer">
          <Image src={bg} layout="fill" objectFit="cover" alt="A picture of a group of flats from ground level" priority/>
        </div>
        <main>
          <div className="pageContentContainer">
            <CompareTable uuid={uuid} ids={router.query.ids}/>
          </div>
        </main>
      </div>
    </div>
  );
}
