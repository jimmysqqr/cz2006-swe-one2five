import React, { useState } from "react";
import { useRouter } from 'next/router'
import Head from "next/head";
import Image from "next/image";
import { v4 } from "uuid";

import { useLocalStorage } from "/components/data/localStorageControl";
import Header from "/components/Header";
import {Form} from "/components/Form";
import bg from "/public/lookup_bg.jpg";
import { roomValuetoDisplay } from "/components/data/formOptions";

export default function LookupPage() {
  const router = useRouter();

  let roomOptions_compulsory = roomValuetoDisplay.slice(1)
  const [form, setForm] = useState({
    targetStreet: "",
    targetBlock: "",
    roomType: roomOptions_compulsory[0][0],
  });
  const [uuid, setUuid] = useLocalStorage("uuid", v4());


  function handleSubmit(event) {
    event.preventDefault();
    console.log(form);
    router.push({
      pathname: `/lookup/results`,
      query: { ...form },
    });
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
        <Header uuid={uuid}/>
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
            <Form page="lookup" formState={form} setFormState={setForm} handleSubmit={handleSubmit} options={{roomType: roomOptions_compulsory}}/>
          </div>
        </main>
      </div>
    </div>
  );
}
