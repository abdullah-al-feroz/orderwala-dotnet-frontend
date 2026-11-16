import React, { useEffect, useRef } from "react";
import Rickshaw from "rickshaw";

const MyComponent = () => {
  const rs1Ref = useRef(null);
  const rs2Ref = useRef(null);
  const rs3Ref = useRef(null);

  useEffect(() => {
    if (rs1Ref.current && rs2Ref.current && rs3Ref.current) {
      var rs1 = new Rickshaw.Graph({
        element: rs1Ref.current,
        renderer: "area",
        max: 80,
        stroke: true,
        series: [
          {
            data: [
              { x: 0, y: 20 },
              { x: 1, y: 10 },
              { x: 2, y: 15 },
              { x: 3, y: 10 },
              { x: 4, y: 15 },
              { x: 5, y: 5 },
              { x: 6, y: 15 },
              { x: 7, y: 10 },
              { x: 8, y: 20 },
              { x: 9, y: 25 },
              { x: 10, y: 35 },
            ],
            color: "#fdc390",
            stroke: "#FB9337",
          },
        ],
      });
      rs1.render();

      // Here is where you would duplicate the code above for rs2 and rs3,
      // replacing `rs1` and `rs1Ref.current` with `rs2`/`rs2Ref.current` and `rs3`/`rs3Ref.current`.
      var rs2 = new Rickshaw.Graph({
        element: rs2Ref.current,
        renderer: "area",
        max: 80,
        stroke: true,
        series: [
          {
            data: [
              { x: 0, y: 20 },
              { x: 1, y: 10 },
              { x: 2, y: 15 },
              { x: 3, y: 10 },
              { x: 4, y: 15 },
              { x: 5, y: 5 },
              { x: 6, y: 15 },
              { x: 7, y: 10 },
              { x: 8, y: 20 },
              { x: 9, y: 25 },
              { x: 10, y: 35 },
            ],
            color: "#fdc390",
            stroke: "#FB9337",
          },
        ],
      });
      rs2.render();

      // If you need the ResizeSensor functionality, you'll have to find an equivalent method
      // that's compatible with React, as direct DOM manipulation like this can cause issues.
    }
  }, []);

  return (
    <div>
      <div id="rs1" ref={rs1Ref}></div>
      <div id="rs2" ref={rs2Ref}></div>
      <div id="rs3" ref={rs3Ref}></div>
    </div>
  );
};

export default MyComponent;
