import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";
import { v4 } from "uuid";

import Header from "/components/Header.js";
import { loadData, postData } from "/components/data/httpRequestControl";
import { useLocalStorage } from "/components/data/localStorageControl";
import { capitalizeTheFirstLetterOfEachWord } from "/components/data/formOptions";
import bg from "/public/lookup_bg.jpg";
import { LookupResults } from "/components/LookupResults";

export default function LookupResultsPage() {
  const router = useRouter();
  console.log(router.query);

  const [form, setForm] = useState({
    street: "",
    block: "",
    town: "",
    roomType: "",
    calPrice: "",
    percentile10: "",
    percentile90: "",
    futureEst: "",
    map: "",
    amenities: "",
    similarCount: "",
    approvalDate: "",
  });
  const [uuid, setUuid] = useLocalStorage("uuid", v4());
  const [isSaved, setIsSaved] = useState(false);

  function handleSubmit(event) {
    event.preventDefault();
    if (!isSaved) {
      postData(`/api/v1/savedFlats/${uuid}`, {
        block: form.block,
        street_name: form.street,
        town: form.town,
        flat_type: form.roomType,
      })
        .then((res) => res.json())
        .then(
          (result) => {
            console.log("create saved flat", result);
            setIsSaved(true);
          },
          (error) => {
            console.log(error);
          }
        );
    }
  }

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
            street: data["targetFlat"]["street_name"],
            block: data["targetFlat"]["block"],
            town: data["targetFlat"]["town"],
            roomType: data["targetFlat"]["flat_type"],
            calPrice: data["avgPrice"],
            percentile10: data["tenPer"],
            percentile90: data["ninetyPer"],
            futureEst: data["predictedPrice"],
            latLong: [data["targetFlat"]["latitude"], data["targetFlat"]["longitude"]],
            amenities: data["amenities"]["amenityList"],
            similarCount: data["similarFlatsFound"],
          }); // does not have approval date as lookup flat does not return it
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
        <Header uuid={uuid}/>
      </div>

      <div className="mainContainer">
        <div className="bgContainer">
          <Image src={bg} layout="fill" objectFit="cover" alt="A living room background" priority />
        </div>
        <main>
          <div className="pageTitleContainer">
            <div className="pageTitle">{capitalizeTheFirstLetterOfEachWord(form.street) + " Blk " + form.block}</div>
            <div className="pageSubtitle">{form.roomType} Flat in {capitalizeTheFirstLetterOfEachWord(form.town)}</div>
          </div>
          <div className="pageContentContainer">
            <LookupResults formState={form} handleSubmit={handleSubmit} isSaved={isSaved} />
          </div>
        </main>
      </div>
    </div>
  );
}
