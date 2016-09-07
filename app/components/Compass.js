import React from 'react';

import Svg,{
    Circle,
    G,
    Rect,
    Text,
} from 'react-native-svg';

const calculateOffSet = (userLocation, placeLocation) => {
  let offset = {
    xOffset: (userLocation.threeLat - placeLocation.lat) * 0.3,
    zOffset: (placeLocation.lon - userLocation.threeLon) * 0.3
  };
  return offset;
};

const Compass = (props) => {

  let renderPlacesOnCompass = (originX, originZ) => {
    return props.places.map((place, idx) => {
      let offset = calculateOffSet(props.currentLocation, place);
      let theta = Math.atan2(offset.xOffset, offset.zOffset) * 180 / Math.PI;
      let hypontenus = Math.sqrt(offset.xOffset * offset.xOffset + offset.zOffset * offset.zOffset);

      //dots color are different base on their type, blue is default
      let colorSolid = 'rgba(0,0,255,1)';
      let colorFade = 'rgba(0,0,255,.2)';
      let size = '3';
      if (place.type && (place.type === 'userPlace')) {
        colorSolid = 'rgba(255,0,0,1)';
        colorFade = 'rgba(255,0,0,.2)';
        size =  '4';
      } else if (place.type && (place.type === 'userEvent')) {
        colorSolid = 'rgba(255,255,0,1)';
        colorFade = 'rgba(255,255,0,.2)';
        size =  '4';
      }

      let oppositeLength = Math.abs(Math.sin(90 - theta + 45 * Math.PI / 180) * hypontenus);
      let adjacentLength = Math.abs(Math.cos(90 - theta + 45 * Math.PI / 180) * hypontenus);
      if (oppositeLength < 42 && adjacentLength < 42) {
        return (
          <G x={`${originZ + offset.zOffset}`} y={`${originX + offset.xOffset}`} originX="1.5" originY="1.5" key={idx} >
            <Circle cx="0" cy="0" r={size} fill={colorSolid}/>
          </G>
        );
      } else if (oppositeLength < 50 && adjacentLength < 50) {
        return (
          <G x={`${originZ + offset.zOffset}`} y={`${originX + offset.xOffset}`} originX="1.5" originY="1.5" key={idx}>
            <Circle cx="0" cy="0" r={size} fill={colorFade}/>
          </G>
        );
      } else {
        return;
      }
    });
  };

  //this is the arrow at the center
  let renderArrow = () => {
    return (
      <G id="arrow"
        rotate="-135"
        origin="0, 0"
        x="115"
        y="500"
      >
        <G
          fill="rgba(0,255,255,1)"
        >
          <Circle r="6" />
          <Rect width="6" height="6" />
          <Circle r="3" fill="rgba(0,0,255,1)"/>
        </G>

      </G>
    );
  };

  return (
    <Svg
      width="600"
      height="800">

      {renderArrow()}
      <G
        x="70"
        y="455">

        <G
          rotate={`${-1 * props.rotation}`}
          origin="45, 45">

          {/* this is the square with the north lable */}
          <G
            rotate={`${-45}`}
            origin="45, 45">
            <Rect
              width="90"
              height="90"
              fill="rgba(0,255,255,.2)"
              strokeWidth="3"
              stroke="rgba(0,255,255,.2)"/>

            {/* this is the letter N */}
            <G
              rotate={45}
              origin="78, 4">
              <Text
                fill="cyan"
                fontSize="12"
                x="84"
                y="0"
                textAnchor="middle">
                N
              </Text>
            </G>
          </G>

          {renderPlacesOnCompass(45, 45)}
        </G>
      </G>
    </Svg>
  );
};

export default Compass;