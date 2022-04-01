import React, { useState } from "react";
import Head from "next/head";
import Image from "next/image";

import Header from "/components/Header";
import bg from "/public/compare_bg.jpg";
import { ChooseFlats } from "/components/ChooseFlats";

export default function ComparePage() {

  const [form, setForm] = useState([]);

  function handleSubmit(event) {
    event.preventDefault();
    console.log(form);
    console.log("compare");
  }

  return (
    <div className="pageContainer">
      <Head>
        <title>Rentigo - Compare</title>
        <meta
          name="description"
          content="Compare between your saved flats side-by-side using the tool below!"
        />
        <link rel="icon" href="/icon.png" />
      </Head>

      <div className="headerContainer">
        <Header />
      </div>

      <div className="mainContainer">
        <div className="bgContainer">
          <Image src={bg} layout="fill" objectFit="cover" alt="A picture of a group of flats from ground level" priority />
        </div>
        <main>
          <div className="pageTitleContainer">
            <div className="pageTitle">Compare Saved Flats</div>
            <div className="pageSubtitle">Compare between your saved flats side-by-side using the tool below!</div>
          </div>
          <div className="pageContentContainer">
            <ChooseFlats 
            formState={form}
            setFormState={setForm}
            handleSubmit={handleSubmit}/>
          </div>
        </main>
      </div>
    </div>
  );
}
