import React from "react";
import { storiesOf } from "@storybook/react";
import { Bridge } from "../index.tsx";

const stories = storiesOf("Socket Widget", module);

stories.add("Bridge", () => {
  return <Bridge />;
});