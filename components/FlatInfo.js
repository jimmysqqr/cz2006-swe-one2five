import React, { useState, useEffect, useRef } from "react";

import { Wrapper, Status } from "@googlemaps/react-wrapper";
import { loadData } from "/components/data/httpRequestControl";
import { CustomLocationInput, DistanceResults, handleDistanceKeyPressHook } from "/components/CustomLocation";
import amenityPin from "/public/amenity_pin.png";
import locationPin from "/public/location_pin.png";

import styles from "./FlatInfo.module.scss";

export function AggregateInfo(props) {
  return (
    <div className={`${styles.aggregate} ${styles.container}`}>
      <div className={styles.header}>Based on {props.similarCount} similar flat(s) in the same town,</div>
      <div className={styles.section}>
        <div className={styles.sectionHeader}>Calculated Market Price</div>
        <div className={styles.sectionContent}>
          <PriceRange calPrice={props.calPrice} percentile10={props.percentile10} percentile90={props.percentile90} />
        </div>
      </div>
      <div className={styles.section}>
        <div className={styles.sectionHeader}>Future Estimate</div>
        <div className={styles.sectionContent}>
          <PriceFuture futureEst={props.futureEst} />
        </div>
      </div>
    </div>
  );
}

export function SingleInfo(props) {
  return (
    <div className={`${styles.single} ${styles.container}`}>
      <div className={styles.section}>
        <div className={styles.sectionHeader}>Nearby Amenities</div>
        <div className={styles.sectionContent}>
          <div className={styles.amenityListContainer}>
            <AmenityList
              amenities={props.amenities}
              currentIDHighlight={props.currentIDHighlight}
              onClick={props.onClick}
            />
          </div>
        </div>
      </div>
      <div className={styles.section}>
        <div className={styles.sectionHeader}>Distance to Custom Location</div>
        <div className={styles.sectionContent}>
          <FlatInfo_CustomLocation latLong={props.latLong} />
        </div>
      </div>
      <div className={styles.footer}>
        Rental Approval Date:{" "}
        {new Date(props.approvalDate).toLocaleDateString("en-US", {
          month: "long",
          year: "numeric",
        })}
      </div>
    </div>
  );
}

export function PriceRange(props) {
  return (
    <>
      {!props.approvalDate | (Math.round(props.percentile10) != Math.round(props.percentile90)) ? (
        <div className={styles.priceRange}>
          <div className={styles.priceRangeNumberContainer}>
            <div className={styles.numberGroup}>
              <div className={`${styles.number} ${styles.secondary}`}>$ {Math.round(props.percentile10)}</div>
              <div className={styles.label}>10th percentile</div>
            </div>
            <div className={styles.numberGroup}>
              <div className={`${styles.number} ${styles.primary}`}>$ {Math.round(props.calPrice)}</div>
              <div className={styles.label}>Average price</div>
            </div>
            <div className={styles.numberGroup}>
              <div className={`${styles.number} ${styles.secondary}`}>$ {Math.round(props.percentile90)}</div>
              <div className={styles.label}>90th percentile</div>
            </div>
          </div>
          <div className={styles.priceRangeLineContainer}>
            <div className={styles.line}></div>
            <div className={`${styles.circle} ${styles.secondary}`}></div>
            <div className={`${styles.circle} ${styles.primary}`}></div>
            <div className={`${styles.circle} ${styles.secondary}`}></div>
          </div>
        </div>
      ) : (
        <div className={styles.priceRange}>
          <div className={styles.numberGroup}>
            <div className={`${styles.number} ${styles.primary}`}>$ {Math.round(props.calPrice)}</div>
            <div className={styles.label}>
              {props.approvalDate ? "Rental price" : "Not enough data to show price distribution"}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export function PriceFuture(props) {
  return (
    <div className={styles.priceFuture}>
      <div className={styles.numberGroup}>
        {props.futureEst !== null ? (
          <>
            <div className={`${styles.number}`}>$ {Math.round(props.futureEst)}</div>
            <div className={styles.label}>next month</div>
          </>
        ) : (
          <div className={styles.label}>Not enough information</div>
        )}
      </div>
    </div>
  );
}

export function AmenityList(props) {
  let arr = props.amenities;
  if (arr.length) {
    arr.sort((a, b) => (a["dist_from_flat"]["value"] <= b["dist_from_flat"]["value"] ? -1 : 1));
  }

  return (
    <ul className={styles.amenityList}>
      {arr.length ? (
        arr.map((value) => (
          <li
            className={`${styles.amenity} ${value.place_id === props.currentIDHighlight ? styles.highlight : ""}`}
            key={value.place_id}
            onClick={() =>
              props.onClick(value.place_id, {
                lat: value.geometry.location.lat,
                lng: value.geometry.location.lng,
              })
            }
          >
            <div className={styles.amenityName}>{value.name}</div>
            <div className={styles.amenityDistance}>
              {value["dist_from_flat"]["value"] > 999
                ? `${(Math.round(value["dist_from_flat"]["value"] / 100) / 10).toFixed(1)}km`
                : `${value["dist_from_flat"]["value"]}m`}
            </div>
          </li>
        ))
      ) : (
        <></>
      )}
    </ul>
  );
}

export function AmenityMap(props) {
  console.log(props);
  let zoom = props.latLong ? 15.5 : 10;

  // function onClick(event) {
  //   console.log("click", event);
  // }
  // function onIdle(event) {
  //   console.log("idle", event);
  // }
  let locationIcon = {url: locationPin.src};
  let amenityIcon = {url: amenityPin.src};
  // if (typeof window !== "undefined") {
  //   if (typeof window.google !== undefined) {
  //     console.log(window.google);
  //     locationIcon = {
  //       url: locationPin.src,
  //       scaledSize: new window.google.maps.Size(50, 50),
  //       origin: new window.google.maps.Point(0, 0),
  //       anchor: new window.google.maps.Point(25, 50),
  //     };
  //     amenityIcon = {
  //       url: amenityPin.src,
  //       size: new window.google.maps.Size(32, 32),
  //       origin: new window.google.maps.Point(0, 0),
  //       anchor: new window.google.maps.Point(16, 32),
  //     };
  //   }
  // }

  // useEffect(() => {
  //   if (typeof window !== "undefined" & typeof window.google !== "undefined") {
  //     console.log("window.google", window.google);
  //     locationIcon = {
  //       url: locationPin.src,
  //       scaledSize: new window.google.maps.Size(50, 50),
  //       origin: new google.maps.Point(0, 0),
  //       anchor: new google.maps.Point(25, 50),
  //     };
  //     amenityIcon = {
  //       url: amenityPin.src,
  //       size: new window.google.maps.Size(32, 32),
  //       origin: new google.maps.Point(0, 0),
  //       anchor: new google.maps.Point(16, 32),
  //     };
  //   }
  // }, [window]);

  return (
    <Wrapper apiKey={process.env.AMENITIES_GGMAPSAPIKEY}>
      <Map
        center={props.center}
        // onClick={onClick}
        // onIdle={onIdle}
        zoom={zoom}
        style={{ flexGrow: "1", height: "100%" }}
      >
        <Marker key={"flat"} onClick={() => props.onMarkerClick("")} position={props.latLong} icon={locationIcon} />
        {props.amenities
          ? props.amenities.map((amenity) => (
              <Marker
                key={amenity.place_id}
                onClick={() => props.onMarkerClick(amenity.place_id)}
                position={{
                  lat: amenity.geometry.location.lat,
                  lng: amenity.geometry.location.lng,
                }}
                icon={amenityIcon}
              />
            ))
          : ""}
      </Map>
    </Wrapper>
  );
}

function Map(props) {
  const ref = useRef(null);
  const [map, setMap] = useState();

  useEffect(() => {
    if (ref.current && !map) {
      setMap(new window.google.maps.Map(ref.current, {}));
    }
  }, [ref, map]);

  // because React does not do deep comparisons, a custom hook is used
  // see discussion in https://github.com/googlemaps/js-samples/issues/946
  useEffect(() => {
    if (map) {
      map.setOptions({ center: props.center, zoom: props.zoom });
    }
  }, [map, props.center, props.zoom]);

  // useEffect(() => {
  //   if (map) {
  //     ["click", "idle"].forEach((eventName) =>
  //       google.maps.event.clearListeners(map, eventName)
  //     );

  //     if (props.onClick) {
  //       map.addListener("click", props.onClick);
  //     }

  //     if (props.onIdle) {
  //       map.addListener("idle", () => props.onIdle(map));
  //     }
  //   }
  // }, [map, props]);

  return (
    <>
      <div ref={ref} style={props.style} />
      {React.Children.map(props.children, (child) => {
        if (React.isValidElement(child)) {
          // set the map prop on the child component
          return React.cloneElement(child, { map });
        }
      })}
    </>
  );
}

const Marker = (options) => {
  const [marker, setMarker] = React.useState();

  useEffect(() => {
    if (!marker) {
      setMarker(new google.maps.Marker());
    }

    // remove marker from map on unmount
    return () => {
      if (marker) {
        marker.setMap(null);
      }
    };
  }, [marker]);

  useEffect(() => {
    if (marker) {
      ["click"].forEach((eventName) => google.maps.event.clearListeners(marker, eventName));

      if (options.onClick) {
        marker.addListener("click", options.onClick);
      }
    }
  }, [marker, options.onClick]);

  useEffect(() => {
    if (marker) {
      marker.setOptions(options);
    }
  }, [marker, options]);

  return null;
};

export function FlatInfo_CustomLocation(props) {
  const [distance, setDistance] = useState("");

  function handleKeyPress(event) {
    if (event.key === "Enter") {
      let changedValue = event.target.value;
      console.log(changedValue);
      handleDistanceKeyPressHook(changedValue, props.latLong).then((result) => {
        console.log("hook done", result);
        setDistance(result);
      });
    }
  }

  return (
    <div className={styles.customContainer}>
      <div className={styles.customInputContainer}>
        <CustomLocationInput onKeyPress={handleKeyPress} />
      </div>
      <div className={styles.distanceResultsContainer}>
        <DistanceResults distance={distance} />
      </div>
    </div>
  );
}
