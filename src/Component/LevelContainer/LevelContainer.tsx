// Import React Framework
import React from "react";

// Import CSS
import LevelContainerStyle from "./LevelContainer.module.css";

function LevelContainer(props: any) {
  const { children } = props;
  return <div className={LevelContainerStyle.level_container}>{children}</div>;
}

export default LevelContainer;
