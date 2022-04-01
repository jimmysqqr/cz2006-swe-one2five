export var roomValuetoDisplay = [
  ["1room", "1-Room"],
  ["2room", "2-Room"],
  ["3room", "3-Room"],
  ["4room", "4-Room"],
];

export var amenityValueToDisplay = [
  ["school", "School"],
  ["patrolStation", "Patrol Station"],
  ["communityclub", "Community Club"],
  ["npc", "Police Post"],
];

export function renderOptions(valueToDisplay) {
  let options = valueToDisplay.map((value) => (
    <option value={value[0]} key={value[0]}>{value[1]}</option>
  ))
  return (
    <>
      {options}
    </>
  );
}
