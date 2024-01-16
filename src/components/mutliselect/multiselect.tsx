import { RxCross1 } from "react-icons/rx";
import { useState, useRef, useEffect } from "react";
import { RandomAvatar } from "react-random-avatars";
import "./multiselect.scss";
import { data } from "../../util/data";

interface ItemProps{
  name:string,
  id:number,
}

const Multiselect = () => {
  const [inputValue, setInputValue] = useState("");
  const [options, setOptions] = useState(data);
  const [filteredOptions, setFilteredOptions] = useState(data);
  const [selectedValues, setSelectedValues]: any[] = useState([]);
  const [toggleOptionsList, setToggleOptionsList] = useState(false);
  const [highlightOption, setHighlightOption] = useState(-1);

  const wrapperRef: any = useRef(null);
  const searchBoxRef = useRef(null);

  const onSelectItem = (item: ItemProps) => {
    const newSelectedValues = [...selectedValues, item];
    setSelectedValues(newSelectedValues);

    const newOptions = options.filter(
      (option: ItemProps) => option.name !== item.name
    );
    setFilteredOptions(newOptions);
    setOptions(newOptions);

    setInputValue("");
    setToggleOptionsList(true);
    setHighlightOption(-1);
  };

  const filterOptionsByInput = () => {
    let filteredOptions = options.filter((option) =>
      option.name.toLowerCase().includes(inputValue.toLowerCase())
    );
    setFilteredOptions(filteredOptions);
  };

  const onRemoveSelectedItem = (item: ItemProps) => {
    const newSelectedValues = selectedValues.filter(
      (value: ItemProps) => value.name !== item.name
    );
    setSelectedValues(newSelectedValues);
    setFilteredOptions([...filteredOptions, item]);
    setOptions([...filteredOptions, item]);
    setToggleOptionsList(true);
    setHighlightOption(-1);
  };

  const handleBackspace = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Backspace" && inputValue === "") {
      if (highlightOption >= 0) {
        onRemoveSelectedItem(selectedValues[highlightOption]);
        setHighlightOption(-1);
      } else if (selectedValues.length > 0) {
        setHighlightOption(selectedValues.length - 1);
      }
    }
  };
  const hideOptionsOnClickOutside = (event: { target: any }) => {
    if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
      setToggleOptionsList(false);
    }
  };

  //   document.addEventListener('click', hideOptionsOnClickOutside);

  const onFocus = () => {
    setToggleOptionsList(true);
  };

  useEffect(() => {
    filterOptionsByInput();
  }, [inputValue]);

  return (
    <div
      ref={wrapperRef}
      onClick={(e) => {
        hideOptionsOnClickOutside(e);
      }}
      className="search-wrapper"
    >
      <div className="search-wrapper-input">
        {selectedValues &&
          selectedValues.length > 0 &&
          selectedValues.map((option: ItemProps, i: number) => (
            <span key={i} className="search-wrapper-input-selected-chips">
              <RandomAvatar name={option.name} size={25} />
              <span className="search-wrapper-input-selected-chips-text">
                {option.name}
              </span>
              <RxCross1
                className="search-wrapper-input-selected-chips-icon"
                onClick={() => {
                  onRemoveSelectedItem(option);
                  setToggleOptionsList(true);
                }}
              />
            </span>
          ))}
        <div>
          <input
            type="text"
            ref={searchBoxRef}
            value={inputValue}
            className="search-wrapper-input-box"
            placeholder="Search"
            onChange={(e) => setInputValue(e.target.value)}
            onFocus={onFocus}
            onKeyDown={handleBackspace}
          />
          <div className="search-wrapper-list">
            {toggleOptionsList && (
              <ul className="search-wrapper-list-options">
                {filteredOptions && filteredOptions.length > 0 ? (
                  filteredOptions.map((option, i) => (
                    <li
                      key={i}
                      onClick={(e) => onSelectItem(option)}
                      className="search-wrapper-list-options-value"
                    >
                      <RandomAvatar name={option.name} size={25} />
                      <span>{option.name}</span>
                    </li>
                  ))
                ) : (
                  <div>No data found</div>
                )}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Multiselect;
