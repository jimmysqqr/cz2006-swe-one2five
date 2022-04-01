import React, { useState } from "react";
import Head from "next/head";
import Image from "next/image";

import Header from "/components/Header";
import {Form} from "/components/Form";
import bg from "/public/lookup_bg.jpg";

export default function LookupPage() {

  const [form, setForm] = useState({
    targetStreet: "",
    targetBlock: "",
    roomType: "",
  });

  function handleSubmit(event) {
    event.preventDefault();
    console.log(form);
  }

  return (
    <div className="pageContainer">
      <Head>
        <title>Rentigo - Lookup</title>
        <meta
          name="description"
          content="Already eyeing a flat listed elsewhere? Want to check if it might be above the market rate? Enter its address here and find out!"
        />
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
            <div className="pageTitle">Lookup a Target Flat</div>
            <div className="pageSubtitle">
              Already eyeing a flat listed elsewhere? Want to check if it might be above the market rate?
            </div>
            <div className="pageSubtitle">Enter its address here and find out!</div>
          </div>
          <div className="pageContentContainer">
            <Form page="lookup" formState={form} setFormState={setForm} handleSubmit={handleSubmit} />
          </div>
        </main>
      </div>
    </div>
  );
}
