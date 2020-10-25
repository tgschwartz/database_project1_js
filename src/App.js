import React, { useEffect } from "react";
import "./styles.css";

import { useImmer } from "use-immer";

const DressesApp = () => {
  const [appState, updateState] = useImmer({
    filterType: "all",
    dresses: [],
    customers: [],
    reservations: []
  });

  // Loads dress info already in database
  useEffect(() => {
    fetch("http://localhost:5000/dresses")
      .then(response => response.json())
      .then(json => {
        updateState(draft => {
          draft.dresses = json.dresses;
        });
      });
  }, []);

  // CreateDress
  const Dress = ({id, dress_name, dress_size, available}) => {
    return (
      <li
        style={{
          textDecoration: available ? "line-through" : "none"
        }}
      >
        {"ID: " + id + " | Dress: " + dress_name + ", Size: " + dress_size}
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
        <input type="submit" value="Add Dress" />
      </form>
    );
  };

  const createDressAPI = (dress_name, dress_size) => {
    return fetch("http://localhost:5000/createDress", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        dress_name: dress_name,
        dress_size: dress_size
      })
    })
      .then(response => response.json())
      .then(json => json.dress);
  };

  const createDress = (name, size) => {
    createDressAPI(name, size).then(dress => {
      updateState((draft) => {
        draft.dresses.push({
          id: dress.id,
          dress_name: dress.dress_name,
          dress_size: dress.dress_size,
          available: dress.available
        });
      });
    })
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
      return appState.dresses.filter((dress) => dress.available === 0);
    } else if (appState.filterType === "available") {
      return appState.dresses.filter((dress) => dress.available === 1);
    }
  };

  const setFilterType = (filterType) => {
    updateState((draft) => {
      draft.filterType = filterType;
    });
  };

  // Load reservations info already in database
  useEffect(() => {
    fetch("http://localhost:5000/reservations")
      .then(response => response.json())
      .then(json => {
        updateState(draft => {
          draft.reservationss = json.reservations;
        });
      });
  }, []);

  // Create Reservation
  const Reservation = ({id, customer_id, dress_id}) => {
    return (
      <li>
        {"ID: " + id + " | Dress: " + dress_id + ", customer: " + customer_id}
      </li>
    );
  };

  const ReservationForm = ({ reservationAction }) => {
    // variable to hold a reference to the input
    let reservationDressName;
    let reservationCustomerID;
    let reservationRentDate;

    const handleSubmitReservation = (event) => {
      event.preventDefault();
      reservationAction(reservationDressName.value,
                        reservationCustomerID.value,
                        reservationRentDate.value);
      reservationDressName.value = "";
      reservationCustomerID.value = "";
      reservationRentDate.value = "";
    };

    return (
      <form onSubmit={handleSubmitReservation}>
      <input ref={(r) => (reservationDressName = r)} type="text" placeholder="Dress ID"/>
      <br></br>
      <input ref={(r) => (reservationCustomerID = r)} type="text" placeholder="Customer ID"/>
      <br></br>
      <input ref={(r) => (reservationRentDate = r)} type="text" placeholder="Date: YYYY/MM/DD"/>
      <br></br>
      <input type="submit" value="Reserve" />
    </form>     
    );
  };


  const createReservationAPI = (customer_id, dress_id, rent_date) => {
    return fetch("http://localhost:5000/reservations", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        customer_id: customer_id,
        dress_id: dress_id,
        rent_date: rent_date
      })
    })
      .then(response => response.json())
      .then(json => json.customer);
  };

  const createReservation = (customer_id, dress_id, rent_date) => {
    createReservationAPI(customer_id, dress_id, rent_date).then(reservation => {
      updateState((draft) => {
        draft.reservations.push({
          id: reservation.id,
          customer_id: reservation.customer_id,
          dress_id: reservation.dress_id,
          rent_date: reservation.rent_date
        });
      });
    })
  };

  // Load customer info already in database
  useEffect(() => {
    fetch("http://localhost:5000/customers")
      .then(response => response.json())
      .then(json => {
        updateState(draft => {
          draft.customers = json.customers;
        });
      });
  }, []);

  // Create Customer
  const Customer = ({id, first_name, last_name}) => {
    return (
      <li>
        {"ID: " + id + " | Name: " + first_name + " " + last_name}
      </li>
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
      <input ref={(r) => (customerDateInput = r)} type="text" placeholder="Wedding: YYYY/MM/DD"/>
      <br></br>
      <input type="submit" value="Submit" />
    </form>     
    );
  };


  const createCustomerAPI = (first_name, last_name, phone_number, size, wedding_date) => {
    return fetch("http://localhost:5000/customers", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        first_name: first_name,
        last_name: last_name,
        phone_number: phone_number,
        size: size,
        wedding_date: wedding_date
      })
    })
      .then(response => response.json())
      .then(json => json.customer);
  };

  const createCustomer = (first_name, last_name, phone_number, size, wedding_date) => {
    createCustomerAPI(first_name, last_name, phone_number, size, wedding_date).then(customer => {
      updateState((draft) => {
        draft.customers.push({
          id: customer.id,
          first_name: customer.first_name,
          last_name: customer.last_name
        });
      });
    })
  };


  // Return
  const ReturnDressForm = ({ returnDressAction }) => {
    // variable to hold a reference to the input
    let returnReservationID;
    let returnReturnOn;

    const handleSubmitReturnDress = (event) => {
      event.preventDefault();
      returnDressAction(returnReservationID.value, returnReturnOn.value);
      returnReservationID.value = "";
      returnReturnOn.value = "";
    };

    return (
      <form onSubmit={handleSubmitReturnDress}>
      <input ref={(r) => (returnReservationID = r)} type="text" placeholder="Reservation ID"/>
      <br></br>
      <input ref={(r) => (returnReturnOn = r)} type="text" placeholder="Date: YYYY/MM/DD"/>
      <br></br>
      <input type="submit" value="Return Dress" />
    </form>     
    );
  };


  const returnDressAPI = (reservation_id, return_on) => {
    return fetch("http://localhost:5000/update", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        reservation_id: reservation_id,
        return_on: return_on
      })
    })
      .then(response => response.json())
      .then(json => json.dress_id);
  };

  const returnDress = (reservation_id, return_on) => {
    returnDressAPI(reservation_id, return_on).then(dress_id => {
      updateState((draft) => {
        const dressToUpdate = draft.dresses.find(d => d.id === dress_id);
        dressToUpdate.available = 1;
      });
    })
  };

  // const toggleTaskAPI = (id, completed) => {
  //   return fetch(`http://localhost:5000/tasks/${id}`, {
  //     method: "PUT",
  //     headers: { "content-type": "application/json" },
  //     body: JSON.stringify({
  //       completed: completed
  //     })
  //   })
  //     .then(response => response.json())
  //     .then(json => json.task);
  // };

  // const toggleTask = id => {
  //   const task = appState.tasks.find(t => t.id === id);

  //   toggleTaskAPI(id, !task.completed).then(task => {
  //     updateState(draft => {
  //       const taskToUpdate = draft.tasks.find(t => t.id === id);
  //       taskToUpdate.completed = task.completed;
  //     });
  //   });
  // };

  // const toggleDress = (id) => {
  //   updateState((draft) => {
  //     if (draft.dresses[id].returned === false) {
  //       draft.dresses[id].returned = true;
  //     } else if (draft.dresses[id].returned === true) {
  //       draft.dresses[id].returned = false;
  //     }
  //   });
  // };

  

  // uncomment out JSX blocks as you solve each problem
  // to uncomment, remove the enclosing '{/*' and '*/}'
  return (
    <div>
      <h3> Add a Dress </h3>
      {<DressForm dressAction={createDress} />}
      <h3> Add a Customer </h3>
      {<CustomerForm customerAction={createCustomer} />}
      <h3> Manage Reservations </h3>
      {<ReservationForm reservationAction={createReservation} />}
      {<ReturnDressForm returnDressAction={returnDress} />}

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
            dress_name={dress.dress_name}
            dress_size={dress.dress_size}
            available={dress.available}
            //toggleDress={() => toggleDress(dress.id)}
          />
        ))}
      </ul>

      <h3> Customers </h3>
      <ul>
        {appState.customers.map((customer) => (
          <Customer
            id={customer.id}
            first_name={customer.first_name}
            last_name={customer.last_name}
            phone_number={customer.phone_number}
            size={customer.size}
            wedding_date={customer.wedding_date}/>
        ))}
      </ul>
      
      <h3> Reservations </h3>
      <ul>
        {appState.reservations.map((reservation) => (
          <Reservation
            id={reservation.id}
            customer_id={reservation.customer_id}
            dress_id={reservation.dress_id}/>
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

