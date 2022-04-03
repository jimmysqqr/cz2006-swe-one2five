export var roomValuetoDisplay = [
  ["1-room", "1-Room"],
  ["2-room", "2-Room"],
  ["3-room", "3-Room"],
  ["4-room", "4-Room"],
];

export var amenityValueToDisplay = [
  ["school", "School"],
  ["patrolStation", "Patrol Station"],
  ["communityclub", "Community Club"],
  ["npc", "Police Post"],
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
