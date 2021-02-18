// Import stylesheets
import {
  createTag,
  createSelect,
  createInput,
  cityDataHandlder
} from "./utils";
import "./style.css";

// Write Javascript code!
const appDiv = document.getElementById("app");

let cityData = [];

fetch(
  "https://gist.githack.com/richsoni/37c6743eb8d1d25d8e509eb9efdd6cf7/raw/8ecf8f39e39d68d950d3e27f376eebfd2dfd2023/mockCityData.json"
)
  .then(res => res.json())
  .then(res => {
    cityData = cityDataHandlder(res);
    init();
  });

function init() {
  const formContainer = createTag({
    className: "form-container",
    father: appDiv
  });

  const formTitle = createTag({
    className: "form-title",
    father: formContainer,
    innerText: "Contact Us"
  });

  const formContext = createTag({
    className: "form-context",
    father: formContainer
  });

  createTag({ father: formContext, innerText: "We'll follow up" });
  createTag({
    father: formContext,
    innerText:
      "One of our workspace experts will reach out to you based on your communication preferences."
  });

  const formBody = createTag({ className: "form-body", father: formContainer });

  const formItem = [];

  formItem.push(
    createInput({
      father: formBody,
      placeholder: "Full name",
      required: true,
      type: "text"
    })
  );

  formItem.push(
    createInput({
      father: formBody,
      placeholder: "Work email",
      required: true,
      pattern:
        "^[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?.)+[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?$",
      type: "email"
    })
  );

  formItem.push(
    createSelect({
      father: formBody,
      placeholder: "City",
      options: cityData,
      required: true,
      onChange: e => {
        console.log(e.target.value);
      }
    })
  );

  formItem.push(
    createSelect({
      father: formBody,
      placeholder: "Company Size",
      options: [{ label: "1-10" }, { label: "11-50" }, { label: "51+" }],
      onChange: e => {
        console.log(e.target.value);
      }
    })
  );

  createTag({
    tagName: "button",
    className: "submit",
    father: formContainer,
    innerText: "Get in touch",
    onclick: function() {
      console.log(formItem.map(item => !item.check()));
    }
  });
}
