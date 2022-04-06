export var roomValuetoDisplay = [
  ["", "No Preference"],
  ["1-room", "1-Room"],
  ["2-room", "2-Room"],
  ["3-room", "3-Room"],
  ["4-room", "4-Room"],
  ["5-room", "5-Room"],
  ["executive", "Executive"],
];

export var amenityValueToDisplay = [
  ["", "No Preference"],
  ["school", "School"],
  ["bus_station", "Bus Stop"],
  ["subway_station", "MRT Station"],
  ["supermarket", "Supermarket"],
  ["doctor", "Healthcare"],
];

export function renderOptions(valueToDisplay) {
  let options = valueToDisplay.map((value) => (
    <option value={value[0]} key={value[0]}>
      {value[1]}
    </option>
  ));
  return <>{options}</>;
}

export function capitalizeTheFirstLetterOfEachWord(words) {
  var separateWord = words.toLowerCase().split(" ");
  for (var i = 0; i < separateWord.length; i++) {
    separateWord[i] = separateWord[i].charAt(0).toUpperCase() + separateWord[i].substring(1).toLowerCase();
  }
  return separateWord.join(" ");
}
