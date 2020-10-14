import React from "react";
import "./styles.css";

import { useImmer } from "use-immer";

const DressesApp = () => {
  const [appState, updateState] = useImmer({
    filterType: "all",
    dresses: [
      { id: 0, name: "uno", size: 2, returned: true },
      { id: 1, name: "dos", size: 4, returned: false }
    ],
    customers: [
      {
        id: 8,
        first_name: "Tova",
        last_name: "Schwartz",
        size: 14,
        wedding_date: "04/03/2021"
      }
    ]
  });

  const Dress = ({ id, name, size, returned, toggleDress }) => {
    return (
      <li
        onClick={toggleDress}
        style={{
          textDecoration: returned ? "line-through" : "none"
        }}
      >
        {"Dress: " + name + " | size: " + size}
      </li>
    );
  };

  const DressForm = ({ dressAction }) => {
    // variable to hold a reference to the input
    let dressNameInput;
    let dressSizeInput;

    const handleSubmit = (event) => {
      event.preventDefault();
      dressAction(dressNameInput.value, dressSizeInput.value);
      dressNameInput.value = "";
      dressSizeInput.value = "";
    };

    return (
      <form onSubmit={handleSubmit}>
        <label>Dress name:</label>
        <input ref={(r) => (dressNameInput = r)} type="text" />
        <br></br>
        <label>Dress size:</label>
        <input ref={(r) => (dressSizeInput = r)} type="text" />
        <br></br>
        <input type="submit" value="Submit" />
      </form>
    );
  };

  const createDress = (name, size) => {
    updateState((draft) => {
      draft.dresses.push({
        id: draft.dresses.length,
        name: name,
        size: size,
        returned: false
      });
    });
  };

  const toggleDress = (id) => {
    updateState((draft) => {
      if (draft.dresses[id].returned === false) {
        draft.dresses[id].returned = true;
      } else if (draft.dresses[id].returned === true) {
        draft.dresses[id].returned = false;
      }
    });
  };

  const ReturnedFilter = ({ filterType, setFilterType }) => (
    <span>
      {["all", "returned", "rented"].map((status, i) => {
        return (
          <button
            onClick={() => setFilterType(status)}
            disabled={appState.filterType === status}
          >
            {status}
          </button>
        );
      })}
    </span>
  );

  const filteredDresses = () => {
    if (appState.filterType === "all") {
      return appState.dresses;
    } else if (appState.filterType === "returned") {
      return appState.dresses.filter((dress) => dress.returned === true);
    } else if (appState.filterType === "rented") {
      return appState.dresses.filter((dress) => dress.returned === false);
    }
  };

  const setFilterType = (filterType) => {
    updateState((draft) => {
      draft.filterType = filterType;
    });
  };

  // uncomment out JSX blocks as you solve each problem
  // to uncomment, remove the enclosing '{/*' and '*/}'
  return (
    <div>
      <h3> Add a Dress </h3>
      {<DressForm dressAction={createDress} />}

      <h3> Dresses </h3>
      {
        <ReturnedFilter
          filterType={appState.filterType}
          setFilterType={setFilterType}
        />
      }
      <ul>
        {filteredDresses().map((dress) => (
          <Dress
            key={dress.id}
            name={dress.name}
            size={dress.size}
            returned={dress.returned}
            toggleDress={() => toggleDress(dress.id)}
          />
        ))}
      </ul>
    </div>
  );
};

export default function App() {
  return (
    <div className="App">
      <DressesApp />
    </div>
  );
}
