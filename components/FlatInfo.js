import React, { useState, useEffect } from "react";

import { loadData } from "/components/data/httpRequestControl";
import { CustomLocationInput, DistanceResults, handleDistanceKeyPressHook } from "/components/CustomLocation";

import styles from "./FlatInfo.module.scss";

// import { Wrapper, Status } from "@googlemaps/react-wrapper";

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
          <AmenityList amenities={props.amenities} />
        </div>
      </div>
      <div className={styles.section}>
        <div className={styles.sectionHeader}>Distance to Custom Location</div>
        <div className={styles.sectionContent}>
          <FlatInfo_CustomLocation latLong={props.latLong} />
        </div>
      </div>
      <div className={styles.footer}>{props.approvalDate}</div>
    </div>
  );
}

export function PriceRange(props) {
  return (
    <>
      {Math.round(props.percentile10) != Math.round(props.percentile90) ? (
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
    arr.sort((a, b) => a["dist_from_flat"]["value"] <= b["dist_from_flat"]["value"]? -1 : 1);
  }

  return (
    <ul className={styles.amenityList}>
      {arr.length ? (
        arr.map((value) => (
          <li className={styles.amenity} key={value.place_id}>
            <div className={styles.amenityName}>{value.name}</div>
            <div className={styles.amenityDistance}>{value["dist_from_flat"]["value"] > 999 ? `${(Math.round(value["dist_from_flat"]["value"]/100)/10).toFixed(1)}km` : `${value["dist_from_flat"]["value"]}m`}</div>
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

   const key = process.env.Dist_Coords_GGMapsAPIKey;
  
  let src = "https://www.google.com/maps/embed/v1/place?" + 
    "key=" + key +
    "&q=NTU+North+Spine,Singapore";

  return (
    <div>
      {/* <iframe 
        id="mapIframe"
        className={styles.mapContainer}
        frameborder="0"
        loading="lazy"
        allowfullscreen
        referrerpolicy="no-referrer-when-downgrade"
        src={src}
      >
      </iframe> */}
    </div>
  )

  // let src = "https://maps.googleapis.com/maps/api/js? + 
  // "key=" + process.env.Dist_Coords_GGMapsAPIKey +
  // "&callback=initMap" + 
  // "&v=weekly&channel=2";

  // function initMap() {
  //   const middleSG = { lat: 1.34791, lng: 103.83288 };
  
  //   map = new google.maps.Map(document.getElementById("map"), {
  //     zoom: 11,
  //     center: middleSG,
  //     fullScreenControl: true, // allow user to enlarge map
  //     gestureHandling: "cooperative", // only zoom in when ctrl button pressed (if not, greedy)
  //     //restriction: { north: northLat, south: southLat, west: -180, east: 180 }; // to restrict how much user zooms out
  //   });
  // }



  // const [clicks, setClicks] = React.useState();
  // const [zoom, setZoom] = React.useState(3); // initial zoom
  // const [center, setCenter] = React.useState<google.maps.LatLngLiteral>({
  //   lat: 0,
  //   lng: 0,
  // });
  
  // const render = (status) => {
  //   return <h1>{status}</h1>;
  // };

  // const Map = ({
  //   onClick,
  //   onIdle,
  //   children,
  //   style,
  //   ...options
  // }) => {
  //   const ref = React.useRef<HTMLDivElement>(null);
  //   const [map, setMap] = React.useState();
  
  //   React.useEffect(() => {
  //     if (ref.current && !map) {
  //       setMap(new window.google.maps.Map(ref.current, {}));
  //     }
  //   }, [ref, map]);

  //   return (
  //     <>
  //       <div ref={ref} style={style} />
  //       {React.Children.map(children, (child) => {
  //         if (React.isValidElement(child)) {
  //           // set the map prop on the child component
  //           return React.cloneElement(child, { map });
  //         }
  //       })}
  //     </>
  //   );
  // }

  // return (
  //   <div style={{ display: "flex", height: "100%" }}>
  //   <Wrapper apiKey={"AIzaSyB4C3UfSaq-9qQXITAIHjCFCUqBWP2nUzM"} render={render}>
  //     <Map
  //       center={center}
  //       //onClick={onClick}
  //       //onIdle={onIdle}
  //       zoom={zoom}
  //       style={{ flexGrow: "1", height: "100%" }}
  //     >
  //       {clicks.map((latLng, i) => (
  //         <Marker key={i} position={latLng} />
  //       ))}
  //     </Map>
  //   </Wrapper>

  // </div>
  // );

  //   const middleSG = { lat: 1.34791, lng: 103.83288 };
  
  //   map = new google.maps.Map(document.getElementById("map"), {
  //     zoom: 11,
  //     center: middleSG,
  //   });
 

  // return (
  //   <Wrapper apiKey={"AIzaSyB4C3UfSaq-9qQXITAIHjCFCUqBWP2nUzM"} >
  //     <></>
  //   </Wrapper>
  // );

  // return (
  //   <div>
  //     <script async defer
  //     src="https://maps.googleapis.com/maps/api/js?key=AIzaSyBlwgdCh6_NyNSZXy5S_rqIMGf81SIwlj8&callback=initMap&v=weekly&channel=2"
  //   ></script>
  //     <Wrapper apiKey={"AIzaSyB4C3UfSaq-9qQXITAIHjCFCUqBWP2nUzM"} >
  //       <Map></Map>
  //     </Wrapper>
  //   </div>
  // )

  return <div className={styles.mapContainer}>Hi Im map centred on {props.latLong}</div>;
}

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
