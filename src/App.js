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
        phone: '1234321',
        size: 1,
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

  const Customer = ({ id, first_name, last_name, phone, size, wedding_date}) => {
    return (
      <li>
        {"ID: " + id + ", Name: " + first_name + " " + last_name}
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
        <input ref={(r) => (dressNameInput = r)} type="text" placeholder="Dress Name"/>
        <br></br>
        <input ref={(r) => (dressSizeInput = r)} type="text" placeholder="Dress Size"/>
        <br></br>
        <input type="submit" value="Submit" />
      </form>
    );
  };

  const CustomerForm = ({ customerAction }) => {
    // variable to hold a reference to the input
    let customerFirstNameInput;
    let customerLastNameInput;
    let customerPhoneInput;
    let customerSizeInput;
    let customerDateInput;

    const handleSubmitCustomer = (event) => {
      event.preventDefault();
      customerAction(customerFirstNameInput.value,
                     customerLastNameInput.value,
                     customerPhoneInput.value,
                     customerSizeInput.value,
                     customerDateInput.value);
      customerFirstNameInput.value = "";
      customerLastNameInput.value = "";
      customerPhoneInput.value = "";
      customerSizeInput.value = "";
      customerDateInput.value = "";
    };

    return (
      <form onSubmit={handleSubmitCustomer}>
      <input ref={(r) => (customerFirstNameInput = r)} type="text" placeholder="First Name"/>
      <br></br>
      <input ref={(r) => (customerLastNameInput = r)} type="text" placeholder="Last Name"/>
      <br></br>
      <input ref={(r) => (customerPhoneInput = r)} type="text" placeholder="Phone Number"/>
      <br></br>
      <input ref={(r) => (customerSizeInput = r)} type="text" placeholder="Size"/>
      <br></br>
      <input ref={(r) => (customerDateInput = r)} type="text" placeholder="Wedding Date: MM/DD/YYYY"/>
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

  const createCustomer = (first_name, last_name, phone, size, wedding_date) => {
    updateState((draft) => {
      draft.customers.push({
        id: draft.dresses.length,
        first_name: first_name,
        last_name: last_name,
        phone: phone,
        size: size,
        wedding_date: wedding_date
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
      {["all", "available", "rented"].map((status, i) => {
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
    } else if (appState.filterType === "rented") {
      return appState.dresses.filter((dress) => dress.returned === true);
    } else if (appState.filterType === "available") {
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
            id={dress.id}
            name={dress.name}
            size={dress.size}
            returned={dress.returned}
            toggleDress={() => toggleDress(dress.id)}
          />
        ))}
      </ul>

      <h3> Add a Customer </h3>
      {<CustomerForm customerAction={createCustomer} />}

      <h3> Customers </h3>
      <ul>
        {appState.customers.map((customer) => (
          <Customer
            id={customer.id}
            first_name={customer.first_name}
            last_name={customer.last_name}
            phone={customer.phone}
            size={customer.size}
            wedding_date={customer.wedding_date}/>
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
