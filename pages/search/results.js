import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookmark } from "@fortawesome/free-regular-svg-icons";
import { v4 } from "uuid";

import Header from "/components/Header";
import { loadData, postData, deleteData } from "/components/data/httpRequestControl";
import { useLocalStorage } from "/components/data/localStorageControl";
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
  const [uuid, setUuid] = useLocalStorage("uuid", v4());
  const [savedFlats, setSavedFlats] = useState([]);
  const [flatListStyles, setFlatListStyles] = useState([]);
  const [selectedFlat, setSelectedFlat] = useState({
    flatID: "",
    latLong: "",
    amenities: "",
    approvalDate: "",
  });
  const [showSingle, setShowSingle] = useState(false);

  function handleSubmit(event) {
    event.preventDefault();
    console.log(form);
    // TODO: loadData again
    router.replace(
      {
        pathname: `/search/results`,
        query: { ...form },
      },
      undefined,
      { shallow: true }
    );
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
          setFlatListStyles(Array(searchResults.flatList.length).fill(false));
          setShowSingle(false);
        },
        (error) => {
          console.log(error);
        }
      );
    loadData(`/api/v1/savedFlats/${uuid}`, {})
      .then((res) => res.json())
      .then(
        (result) => {
          console.log("getAllSavedFlats to mark those alr bookmarked", result);
          if (result["data"].length) {
            setSavedFlats(result["data"]);
          }
        },
        (error) => {
          console.log(error);
        }
      );
  }, [router.query, uuid, searchResults.flatList.length]);

  function onSavedClick(flatID, flatObject) {
    let newSavedFlats = savedFlats.map((flat) => {
      return { ...flat };
    });
    if (!flatObject.isSaved) {
      postData(`/api/v1/savedFlats/${uuid}`, {
        town: flatObject.town,
        block: flatObject.block,
        street_name: flatObject.street,
        flat_type: flatObject.roomType,
        rented_out_id: flatID,
      })
        .then((res) => res.json())
        .then(
          (result) => {
            console.log("create saved flat", result);
            newSavedFlats.push(result["data"]);
            setSavedFlats(newSavedFlats);
          },
          (error) => {
            console.log(error);
          }
        );
    } else {
      let flatToUnsave = newSavedFlats.find((flat) => flat.rented_out_id === flatID); // TODO: make sure I get back a rented_out_id after creating a saved flat so that I can use it here
      deleteData(`/api/v1/savedFlats/${uuid}/${flatToUnsave.id}`, {})
        .then((res) => res.json())
        .then(
          (result) => {
            console.log(`deleted flatID: ${flatID}, savedFlatID: ${flatToUnsave.id}`, result);
            setSavedFlats(newSavedFlats.filter((flat) => flat.rented_out_id !== flatID));
          },
          (error) => {
            console.log(error);
          }
        );
    }
  }

  function handleListItemClick(flatID, flatObject) {
    // if selecting a flat for the first time, so data needed, or selecting another flat while one is already selected
    if (selectedFlat.flatID !== flatID) {
      setShowSingle(true);
      let newFlatListStyles = Array(searchResults.flatList.length).fill(false);
      newFlatListStyles[flatObject.index] = true;
      setFlatListStyles(newFlatListStyles);
      loadData("/api/v1/clickOnFlat", {
        id: flatID,
        flatStatus: "rented-out",
      })
        .then((res) => res.json())
        .then(
          (result) => {
            console.log("clickOnFlat", result);
            let data = result["data"];
            setSelectedFlat({
              flatID: flatID,
              latLong: flatObject.latLong,
              amenities: data.amenityList,
              approvalDate: flatObject.approvalDate,
            });
          },
          (error) => {
            console.log(error);
          }
        );
    } else {
      let newFlatListStyles = Array(searchResults.flatList.length).fill(false);
      if (showSingle) {
        // if deselecting the currently selected flat, so data not needed
        setFlatListStyles(newFlatListStyles);
      } else {
        // if reselecting a flat that was selected and deselected right just now, so data not needed
        newFlatListStyles[flatObject.index] = true;
        setFlatListStyles(newFlatListStyles);
      }
      setShowSingle((showSingle) => !showSingle);
    }
  }

  return (
    <div className="pageContainer">
      <Head>
        <title>Rentigo - Search</title>
        <link rel="icon" href="/icon.png" />
      </Head>

      <div className="headerContainer">
        <Header uuid={uuid} savedFlats={savedFlats} />
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
              handleListItemClick={handleListItemClick}
              flatListStyles={flatListStyles}
              savedFlats={savedFlats}
              selectedFlat={selectedFlat}
              showSingle={showSingle}
            />
          </div>
        </main>
      </div>
    </div>
  );
}
