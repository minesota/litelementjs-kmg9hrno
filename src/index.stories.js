import "./index.js";
import { html } from "lit-html";

export default {
  parameters: {
    layout: "centered",
  },
};

export const story1 = () => html` <idate-input name="cumpleaños" label="prueba" AY="2020" value='16 ene'></idate-input>`;
