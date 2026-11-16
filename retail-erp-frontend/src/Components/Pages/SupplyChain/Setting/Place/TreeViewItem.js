import React, { useState } from "react";

const TreeViewItem = ({ item, level = 0 }) => {
  const [open, setOpen] = useState(false);

  const toggle = () => setOpen(!open);

  // Function to render places under a thana
  const renderPlaces = (thana) => {
    return thana.places.map((place) => (
      <div key={place.id} style={{ paddingLeft: `${50 * (level + 2)}px` }}>
        {place.name}
      </div>
    ));
  };

  // Function to render thanas under a district
  const renderThanas = (district) => {
    return district.thanas.map((thana) => (
      <div key={thana.id}>
        <div
          style={{ paddingLeft: `${50 * (level + 1)}px`, cursor: "pointer" }}
          onClick={() => setOpen({ ...open, [thana.id]: !open[thana.id] })}
        >
          {thana.name} <span>{open[thana.id] ? "-" : "+"}</span>
        </div>
        {open[thana.id] && renderPlaces(thana)}
      </div>
    ));
  };

  // Function to render districts under a division
  const renderDistricts = () => {
    return item.districts.map((district) => (
      <div key={district.id}>
        <div
          style={{ paddingLeft: `${50 * level}px`, cursor: "pointer" }}
          onClick={() =>
            setOpen({ ...open, [district.id]: !open[district.id] })
          }
        >
          {district.name} <span>{open[district.id] ? "-" : "+"}</span>
        </div>
        {open[district.id] && renderThanas(district)}
      </div>
    ));
  };

  return (
    <div>
      <div
        style={{ paddingLeft: `${50 * level}px`, cursor: "pointer" }}
        onClick={toggle}
      >
        {item.name} {level < 2 && <span>{open ? "-" : "+"}</span>}
      </div>
      {open && (level === 0 ? renderDistricts() : renderThanas(item))}
    </div>
  );
};

export default TreeViewItem;
