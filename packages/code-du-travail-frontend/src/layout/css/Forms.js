import { createGlobalStyle } from "styled-components";
import { theme } from "@socialgouv/react-ui";

const { animations, box, colors, spacing } = theme;

const RADIO_SIZE = "1.1em";

export default createGlobalStyle`
  label {
    cursor: pointer;
  }

  fieldset {
    padding: ${spacing.base};
    border: ${box.border};
  }


  textarea {
    min-height: 8rem;
  }

  textarea,
  input {
    max-width: 100%;
    padding: ${spacing.small} ${spacing.base};
    color: inherit;

    font-size: inherit;
    font-family: inherit;
    line-height: inherit;
    background: ${colors.white};
    border: ${box.border};
    border-radius: ${box.borderRadius};
    appearance: none;

    label + &, label > & {
     vertical-align: top;
    }

    &:focus {
      border: 1px solid ${colors.focus};
      box-shadow: 0 0 2px 2px ${colors.focusShadow};
    }
  }

  input[type="radio"] {
    position: relative;
    display: inline-block;
    flex-shrink: 0;
    width: ${RADIO_SIZE};
    height: ${RADIO_SIZE};
    margin: 0 ${spacing.xsmall} calc(1em / 10) 0;
    padding: 0;
    color: inherit;
    font: inherit;
    line-height: inherit;
    background: ${colors.white};
    border: ${box.border};
    border-radius: 50%;
    cursor: pointer;
    appearance: none;
  }
  input[type="radio"]:checked {
    background-color: ${colors.white};
    border-color: ${colors.blueDark};
  }
  input[type="radio"]::before {
    position: absolute;
    top: calc(50% - ${RADIO_SIZE} / 4);
    left: calc(50% - ${RADIO_SIZE} / 4);
    width: calc(${RADIO_SIZE} / 2);
    height: calc(${RADIO_SIZE} / 2);
    background-color: ${colors.blueDark};
    border-radius: 50%;
    transform: scale(0);
    transition: transform ${animations.transitionTiming} ease-out;
    content: "";
  }
  input[type="radio"]:checked::before {
    transform: scale(1);
  }

  input[type="radio"]:focus {
    box-shadow: none;
  }
  input[type="radio"]:-moz-focusring {
    box-shadow: 0 0 0.15em 0.15em ${colors.focusShadow};
  }
  input[type="radio"]:focus-visible {
    box-shadow: 0 0 0.15em 0.15em ${colors.focusShadow};
  }

  input[type="radio"]:focus:not(:focus-visible) {
    border-color: ${colors.focus};
    outline: none;
  }
  input[type="radio"]:focus:not(:-moz-focusring) {
    border-color: ${colors.focus};
    outline: none;
  }

  select {
    position: relative;
    padding: ${spacing.small} ${spacing.base};
    padding-right: ${spacing.large};
    color: ${colors.black};
    font-size: inherit;
    font-family: inherit;
    line-height: inherit;
    vertical-align: middle;
    background: ${colors.white} url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiA/PjwhRE9DVFlQRSBzdmcgIFBVQkxJQyAnLS8vVzNDLy9EVEQgU1ZHIDEuMC8vRU4nICAnaHR0cDovL3d3dy53My5vcmcvVFIvMjAwMS9SRUMtU1ZHLTIwMDEwOTA0L0RURC9zdmcxMC5kdGQnPjxzdmcgZW5hYmxlLWJhY2tncm91bmQ9Im5ldyAwIDAgMjQgMjQiIGlkPSJMYXllcl8xIiB2ZXJzaW9uPSIxLjAiIHZpZXdCb3g9IjAgMCAyNCAyNCIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+PHBvbHlsaW5lIGZpbGw9Im5vbmUiIHBvaW50cz0iMjEsOC41IDEyLDE3LjUgMyw4LjUgIiBzdHJva2U9IiMwMDAwMDAiIHN0cm9rZS1taXRlcmxpbWl0PSIxMCIgc3Ryb2tlLXdpZHRoPSIyIi8+PC9zdmc+") no-repeat;
    background-position: top .9rem right .75em;
    background-size: 0.7em;
    border: ${box.border};
    border-radius: ${box.borderRadius};
    transition: border-color ${animations.transitionTiming} ease;
    appearance: none;
  }

  select:disabled {
    background-color: ${colors.darkBackground};
  }

  select:focus {
    border-color: ${colors.blueLight};
    outline: none;
    box-shadow: 0 0 0.15rem 0.15rem ${colors.focusShadow};
  }

`;
