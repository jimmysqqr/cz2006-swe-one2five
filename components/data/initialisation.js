import { amenityValueToDisplay, roomValuetoDisplay } from "./formOptions";

export var searchState = {
  town: "",
  roomType: roomValuetoDisplay[0][0],
  nearbyAmenity: amenityValueToDisplay[0][0],
  nearbyAmenityDistance: "",
  priceLowerBound: "",
  priceUpperBound: ""
}