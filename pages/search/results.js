import React, { useState } from "react";
import Head from "next/head";
import Image from "next/image";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBookmark } from "@fortawesome/free-regular-svg-icons";

import Header from "/components/Header";
import {Form} from "/components/Form";
import { searchState } from "/components/data/initialisation";
import { SearchResults } from "/components/SearchResults";
import bg from "/public/search_bg.jpg";

export default function SearchResultsPage() {

  const [form, setForm] = useState(searchState);


  function handleSubmit(event) {
    event.preventDefault();
    console.log(form);
  }


  return (
    <div className="pageContainer">
      <Head>
        <title>Rentigo - Search</title>
        <link rel="icon" href="/icon.png" />
      </Head>

      <div className="headerContainer">
        <Header />
      </div>

      <div className="mainContainer">
        <div className="bgContainer">
          <Image src={bg} layout="fill" objectFit="cover" alt="A night view of a HDB estate" priority />
        </div>
        <main>
          <div className="pageTitleContainer">
            <div className="pageTitle">Search Results</div>
            <div className="pageSubtitle">View the market rate and future estimate, or select a flat to view its details.</div>
            <div className="pageSubtitle">Save a flat to compare later by clicking the <FontAwesomeIcon icon={faBookmark} style={{fontSize:"0.7rem"}}/>  icon! </div>
          </div>
          <div className="pageContentContainer">
            <SearchResults formState={form} setFormState={setForm} handleSubmit={handleSubmit}/>
          </div>
        </main>
      </div>
    </div>
    
  );
}