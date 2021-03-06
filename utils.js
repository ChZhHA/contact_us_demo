export function createTag({
  tagName = "div",
  className,
  style,
  id,
  father,
  ...other
} = {}) {
  const tempDiv = document.createElement(tagName);

  if (className) tempDiv.className = className;
  if (style) tempDiv.style.cssText = style;
  if (id) tempDiv.id = id;
  if (father) father.appendChild(tempDiv);

  Object.assign(tempDiv, other);

  return tempDiv;
}
function setStatus(element, key, value) {
  let target = element;
  while (target.parentElement && target.parentElement.className === "group") {
    target = target.parentElement;
  }
  target.dataset[key] = value;
}
export function createInput({
  placeholder,
  father,
  style,
  required,
  pattern,
  onChange,
  ...other
} = {}) {
  const inputCover = createTag({
    className: "input-cover",
    father,
    style
  });
  const label = createTag({
    className: "label",
    father: inputCover,
    innerText: placeholder + (required ? " *" : "")
  });
  const input = createTag({
    tagName: "input",
    father: inputCover,
    onfocus: function() {
      setStatus(inputCover, "active", true);
    },
    onblur: function() {
      setStatus(inputCover, "active", false);
      checkInput();
    },
    oninput: function(e) {
      if (this.value && this.value.length) {
        setStatus(inputCover, "filled", true);
      } else {
        setStatus(inputCover, "filled", false);
      }
      if (onChange) onChange(e);
      checkInput();
    },
    ...other
  });
  function checkInput() {
    let error = false;
    if (required) {
      if (!input.value) error = true;
    }
    if (pattern) {
      const regx = new RegExp(pattern);
      error = error || !regx.test(input.value);
    }
    inputCover.dataset.error = error;
    return error;
  }
  return { dom: inputCover, check: checkInput };
}

export function createSelect({
  father,
  options = [],
  placeholder,
  style,
  required,
  onChange,
  ...other
} = {}) {
  const selectContainer = createTag({
    className: "select-cover",
    father,
    style
  });
  const selectCover = createTag({
    tagName: "select",
    father: selectContainer,
    style,
    onfocus: function() {
      selectContainer.dataset.active = true;
    },
    onblur: function() {
      selectContainer.dataset.active = false;
      checkInput();
    },
    onchange: function(e) {
      selectContainer.dataset.filled = !!this.value;
      this.blur();
      if (onChange) onChange(e);
      checkInput();
    },
    ...other
  });
  if (placeholder) {
    createTag({
      father: selectCover,
      tagName: "option",
      className: "placeholder",
      value: "",
      selected: true
    });
    createTag({
      father: selectContainer,
      className: "label",
      innerText: placeholder + (required ? " *" : "")
    });
  }
  options.forEach(groups => {
    let groupCover = selectCover;
    if (groups.children) {
      groupCover = createTag({
        father: selectCover,
        tagName: "optgroup",
        label: groups.label
      });
      groups.children.forEach(item => {
        createTag({
          father: groupCover,
          tagName: "option",
          value: item,
          innerText: item
        });
      });
    } else {
      createTag({
        father: groupCover,
        tagName: "option",
        value: groups.label,
        innerText: groups.label
      });
    }
  });
  function checkInput() {
    let error = false;
    if (required) {
      error = !!!selectCover.value;
    }
    selectContainer.dataset.error = error;
    return error;
  }
  return { dom: selectContainer, check: checkInput };
}

export function cityDataHandlder(source) {
  const cityMap = new Map();
  source.forEach(item => {
    if (!cityMap.has(item.country)) {
      cityMap.set(item.country, []);
    }
    cityMap.get(item.country).push(item.name);
  });
  const cityData = [];
  [...cityMap.keys()].sort().forEach(key => {
    cityData.push({ label: key, children: cityMap.get(key).sort() });
  });
  return cityData;
}
