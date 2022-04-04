import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookmark } from "@fortawesome/free-regular-svg-icons";

import Header from "/components/Header";
import { loadData, postData, deleteData } from "/components/data/httpRequestControl";
import { searchState } from "/components/data/initialisation";
import { SearchResults } from "/components/SearchResults";
import bg from "/public/search_bg.jpg";

export default function SearchResultsPage() {
  const router = useRouter();
  let initialState = Object.keys(router.query).length ? { ...router.query } : searchState;

  const [form, setForm] = useState(initialState);
  const [searchResults, setSearchResults] = useState({
    aggData: {},
    flatList: [],
  });

  function handleSubmit(event) {
    event.preventDefault();
    console.log(form);
    // TODO: loadData again
    router.replace({
      pathname: `/search/results`,
      query: { ...form },
    }, 
    undefined, { shallow: true }
    )
  }

  function onSavedClick(flatID, flatObject) {
    let clonedFlatList = JSON.parse(JSON.stringify(searchResults.flatList));

    if (clonedFlatList[flatObject.index]["flat_status"] == "rented-out") {
      postData(`/api/v1/savedFlats/:userToken`, {
        //TODO: usertoken
        block: flatObject.block,
        street_name: flatObject.street,
      })
        .then((res) => res.json())
        .then(
          (result) => {
            console.log("create saved flat", result);
            clonedFlatList[flatObject.index]["flat_status"] = "saved";
            let newSearchResults = {
              aggData: { ...searchResults.aggData },
              flatList: clonedFlatList,
            };
            setSearchResults(newSearchResults);
          },
          (error) => {
            console.log(error);
          }
        );
    } else {
      deleteData(`/api/v1/savedFlats/:userToken/${flatObject.flatID}`, {})
        .then((res) => res.json())
        .then(
          (result) => {
            console.log(`deleted flat ${flatObject.flatID}`, result);
            clonedFlatList[flatObject.index]["flat_status"] = "rented-out";
            let newSearchResults = {
              aggData: { ...searchResults.aggData },
              flatList: clonedFlatList,
            };
            setSearchResults(newSearchResults);
          },
          (error) => {
            console.log(error);
          }
        );
    }
  }

  useEffect(() => {
    loadData("/api/v1/searchRentedFlats", {
      town: router.query.town,
      flatType: router.query.roomType,
      numericFilters: `price>=${router.query.priceLowerBound}, price<=${router.query.priceUpperBound}`,
      amenityType: router.query.nearbyAmenity,
      amenityDist: router.query.nearbyAmenityDistance,
    })
      .then((res) => res.json())
      .then(
        (result) => {
          console.log("searchRentedFlats", result);
          let data = result["data"];
          setSearchResults({
            aggData: {
              calPrice: data["avgPrice"],
              percentile10: data["tenPer"],
              percentile90: data["ninetyPer"],
              futureEst: data["predictedPrice"],
              similarCount: result["found"],
            },
            flatList: data["filteredFlatList"],
          });
        },
        (error) => {
          console.log(error);
        }
      );
  }, [router.query]);

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
            <div className="pageSubtitle">
              View the market rate and future estimate, or select a flat to view its details.
            </div>
            <div className="pageSubtitle">
              Save a flat to compare later by clicking the{" "}
              <FontAwesomeIcon icon={faBookmark} style={{ fontSize: "0.7rem" }} /> icon!{" "}
            </div>
          </div>
          <div className="pageContentContainer">
            <SearchResults
              results={searchResults}
              formState={form}
              onSavedClick={onSavedClick}
              setFormState={setForm}
              handleSubmit={handleSubmit}
              listLength={searchResults.flatList.length}
            />
          </div>
        </main>
      </div>
    </div>
  );
}
