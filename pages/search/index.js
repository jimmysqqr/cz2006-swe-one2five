import React, { useState } from "react";
import { useRouter } from 'next/router'
import Head from "next/head";
import Image from "next/image";
import { v4 } from "uuid";

import Header from "/components/Header";
import {Form} from "/components/Form";
import { useLocalStorage } from "/components/data/localStorageControl";
import { searchState } from "/components/data/initialisation";
import { amenityValueToDisplay, roomValuetoDisplay } from "/components/data/formOptions";

import bg from "/public/search_bg.jpg";

export default function SearchPage() {
  const router = useRouter();

  const [form, setForm] = useState(searchState);
  const [uuid, setUuid] = useLocalStorage("uuid", v4());


  function handleSubmit(event) {
    event.preventDefault();
    console.log(form);
    router.push({
      pathname: `/search/results`,
      query: { ...form },
    });
  }

  return (
    <div className="pageContainer">
      <Head>
        <title>Rentigo - Search</title>
        <meta
          name="description"
          content="Don't know which flat you want to rent? Want to know whether it is worth having more rooms? Use the filters below to narrow down your search!"
        />
        <link rel="icon" href="/icon.png" />
      </Head>

      <div className="headerContainer">
        <Header uuid={uuid}/>
      </div>

      <div className="mainContainer">
        <div className="bgContainer">
          <Image src={bg} layout="fill" objectFit="cover" alt="A night view of a HDB estate" priority />
        </div>
        <main>
          <div className="pageTitleContainer">
            <div className="pageTitle">Search Rented Flats</div>
            <div className="pageSubtitle">Don't know which flat you want to rent? Want to know whether it is worth having more rooms?</div>
            <div className="pageSubtitle">Use the filters below to narrow down your search!</div>
          </div>
          <div className="pageContentContainer">
            <Form page="search" formState={form} setFormState={setForm} handleSubmit={handleSubmit} options={{nearbyAmenity:amenityValueToDisplay, roomType: roomValuetoDisplay}}/>
          </div>
        </main>
      </div>
    </div>
  );
}
