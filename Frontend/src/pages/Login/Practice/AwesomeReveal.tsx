// import React, { Component } from "react";
// import { Slide } from "react-awesome-reveal";

// class AwesomeReveal extends Component {
//   render() {
//     return (
//       <Slide cascade>
//         <ul >
//           <li> Item 1 </li>
//           <li> Item 2 </li>
//           <li> Item 3 </li>
//           <li> Item 4 </li>
//         </ul>
//       </Slide>
//     );
//   }
// }

// export default AwesomeReveal ;

import React from "react";
import {
  Fade,
  Slide,
  Zoom,
  Bounce,
  Flip,
  Hinge,
  JackInTheBox,
  Roll,
  Rotate,
} from "react-awesome-reveal";

function AwesomeReveal() {
  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      {/* <Fade delay={1000}>
        <h1>Fade Animation</h1>
      </Fade>
      <Flip delay={2000}>
        <h1>Flip Animation</h1>
      </Flip>
      <Slide delay={3000} direction="up">
        <h1>Slide Animation from Left</h1>
      </Slide>
      <Hinge>
    <h1>Hinge Animations</h1>
</Hinge>
      <JackInTheBox delay={4000}>
        <h1>Jack In the Box Animations</h1>
      </JackInTheBox>
      <Roll>
    <h1>Roll Animations</h1>
</Roll>
      <Zoom delay={5000}>
        <h2>Zoom In Animation</h2>
      </Zoom>
      <Rotate delay={6000}>
        <h1>Rotate Animations</h1>
      </Rotate>
      <Bounce delay={7000}>
        <h2>Bounce Animation</h2>
      </Bounce> */}
      <Bounce delay={1000}>
        <h2>Bounce Animation</h2>
      </Bounce> 

      <Fade cascade>
        <p>...First...</p>
        <p>...Second...</p>
        <p>...Third...</p>
        <p>...Fourth...</p>
        <p>...Fifth...</p>
      </Fade>
      <Fade cascade damping={1}>
  <p>...this is First...</p>
  <p>...this  is Second...</p>
  <p>...this is Third...</p>
</Fade>
<center>
      <Slide cascade>
        <ul>
          <li> Item 1 </li>
          <li> Item 2 </li>
          <li> Item 3 </li>
          <li> Item 4 </li>
        </ul>
      </Slide></center>
    </div>
  );
}

export default AwesomeReveal;
