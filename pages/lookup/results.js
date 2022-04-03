import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";

import Header from "/components/Header.js";
import { loadData } from "/components/data/httpRequestControl";
import { capitalizeTheFirstLetterOfEachWord } from "/components/data/formOptions";
import bg from "/public/lookup_bg.jpg";
import { LookupResults } from "/components/LookupResults";

export default function LookupResultsPage() {
  const [form, setForm] = useState({
    address: "",
    roomType: "",
    calPrice: "",
    percentile10: "",
    percentile90: "",
    futureEst: "",
    map: "",
    amenities: "",
    similarFlatsFound: ""
  });

  const router = useRouter();
  console.log(router.query);
  useEffect(() => {
    loadData("/api/v1/lookup", {
      street_name: router.query.targetStreet,
      block: router.query.targetBlock,
      flatType: router.query.roomType,
    })
      .then((res) => res.json())
      .then(
        (result) => {
          console.log(result);
          let data = result["data"];
          setForm({
            address: capitalizeTheFirstLetterOfEachWord(data["targetFlat"]["street_name"]) + " Blk " + data["targetFlat"]["block"],
            roomType: data["targetFlat"]["flat_type"],
            calPrice: Math.round(data["avgPrice"]),
            percentile10: Math.round(data["ninetyPer"]),
            percentile90: Math.round(data["tenPer"]),
            futureEst: Math.round(data["predictedPrice"]),
            latLong: [data["targetFlat"]["latitude"], data["targetFlat"]["longitude"]],
            amenities: data["amenities"]["amenityList"],
            similarFlatsFound: data["similarFlatsFound"]
          });
        },
        (error) => {
          console.log(error);
        }
      );
  }, []);

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
          <Image src={bg} layout="fill" objectFit="cover" alt="A living room background" priority />
        </div>
        <main>
          <div className="pageTitleContainer">
            <div className="pageTitle">{form.address}</div>
            <div className="pageSubtitle">{form.roomType} Flat</div>
          </div>
          <div className="pageContentContainer">
            <LookupResults formState={form} />
          </div>
        </main>
      </div>
    </div>
  );
}
