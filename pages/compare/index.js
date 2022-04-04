import React, { useState, useEffect } from "react";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import { v4 } from "uuid";

import { useLocalStorage } from "/components/data/localStorageControl";
import { loadData, deleteData } from "/components/data/httpRequestControl";
import Header from "/components/Header";
import bg from "/public/compare_bg.jpg";
import { ChooseFlats } from "/components/ChooseFlats";

export default function ComparePage() {
  const router = useRouter();

  const [form, setForm] = useState([]);
  const [savedFlats, setSavedFlats] = useState([]);
  const [uuid, setUuid] = useLocalStorage("uuid", v4());

  useEffect(() => {
    loadData(`/api/v1/savedFlats/${uuid}`, {})
      .then((res) => res.json())
      .then(
        (result) => {
          console.log("Compare Page get initial choices", result);
          setSavedFlats(result["data"]);
        },
        (error) => {
          console.log(error);
        }
      );
  }, [uuid]);

  function handleSubmit(event) {
    event.preventDefault();
    console.log(form);
  }

  function handleUnsave(id) {
    let newSavedFlats = savedFlats.map((flat) => {
      return { ...flat };
    });
    let flatToUnsave = newSavedFlats.find((flat) => flat.id === id);
    deleteData(`/api/v1/savedFlats/${uuid}/${id}`, {})
      .then((res) => res.json())
      .then(
        (result) => {
          console.log(`deleted savedFlatID: ${flatToUnsave.id}`, result);
          setSavedFlats(newSavedFlats.filter((flat) => flat.id !== id));
        },
        (error) => {
          console.log(error);
        }
      );
  }

  return (
    <div className="pageContainer">
      <Head>
        <title>Rentigo - Compare</title>
        <meta name="description" content="Compare between your saved flats side-by-side using the tool below!" />
        <link rel="icon" href="/icon.png" />
      </Head>

      <div className="headerContainer">
        <Header uuid={uuid} savedFlats={savedFlats}/>
      </div>

      <div className="mainContainer">
        <div className="bgContainer">
          <Image
            src={bg}
            layout="fill"
            objectFit="cover"
            alt="A picture of a group of flats from ground level"
            priority
          />
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
              handleSubmit={handleSubmit}
              onUnsave={handleUnsave}
              savedFlats={savedFlats}
              uuid={uuid}
            />
          </div>
        </main>
      </div>
    </div>
  );
}
