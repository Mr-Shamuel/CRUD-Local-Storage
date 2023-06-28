import { useState, useEffect } from "react";
import "./App.css";

function App() {
  // State variables
  const [isChecked, setIsChecked] = useState(false);
  const [data, setData] = useState([]);
  const [updatedData, setUpdatedData] = useState({});
  const [btnState, setBtnState] = useState("create");
  const [userData, setUserData] = useState({
    names: "",
    email: "",
    phone: "",
  });

  // Load data from local storage on component mount
  useEffect(() => {
    const allUsers = JSON.parse(localStorage.getItem("users")) || [];
    setData(allUsers);
  }, []);

  // Handle input change
  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  // Handle checkbox change
  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };

  // Delete item from data
  const handleDelete = (item) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this item?"
    );
    if (confirmDelete) {
      const filterItems = data.filter((element) => element.id !== item.id);
      setData(filterItems);
      localStorage.setItem("users", JSON.stringify(filterItems));
    }
  };

  // Edit item
  const handleEdit = (item) => {
    setUpdatedData(item);
    setBtnState("update");
    setUserData({ names: item.names, email: item.email, phone: item.phone });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    if (btnState === "create") {
      const uniqueId = new Date().getTime();
      const newUser = { id: uniqueId, ...userData };
      const newUserData = [...data, newUser];
      setData(newUserData);
      localStorage.setItem("users", JSON.stringify(newUserData));
    } else {
      const updatedUser = data.map((item) =>
        item.id === updatedData.id ? { ...item, ...userData } : item
      );
      setData(updatedUser);
      localStorage.setItem("users", JSON.stringify(updatedUser));
      setBtnState("create");
    }

    setUserData({ names: "", email: "", phone: "" });
  };

  return (
    <>
      <header>
        <h1>Local Storage CRUD</h1>
      </header>

      <section className="d-flex align-items-center justify-content-center py-5">
        <form onSubmit={handleSubmit}>
          <label>Name:</label>
          <input
            type="text"
            name="names"
            placeholder="Enter Name"
            value={userData.names}
            onChange={handleChange}
            required
          />
          <br />

          <label>Email:</label>
          <input
            type="text"
            name="email"
            placeholder="Enter email"
            value={userData.email}
            onChange={handleChange}
            required
          />
          <br />

          <label>Phone:</label>
          <input
            type="text"
            name="phone"
            placeholder="Enter phone"
            value={userData.phone}
            onChange={handleChange}
            required
          />
          <div className="checkbox-container">
            <input
              type="checkbox"
              name="verify"
              checked={isChecked}
              onChange={handleCheckboxChange}
              required
            />
            <label>Are you sure?</label>
          </div>
          <br />

          <button
            type="submit"
            disabled={!isChecked}
            className={
              btnState === "create" ? "create-button" : "update-button"
            }
          >
            {btnState === "create" ? "Create" : "Update"}
          </button>
        </form>
      </section>

      <main>
        {data.length > 0 ? (
          <table className="table  table-striped">
            <thead>
              <tr>
                <th scope="col">#ID</th>
                <th scope="col">Name:</th>
                <th scope="col">Email</th>
                <th scope="col">Phone</th>
                <th scope="col">Action</th>
              </tr>
            </thead>

            <tbody>
              {data.map((item) => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.names}</td>
                  <td>{item.email}</td>
                  <td>{item.phone}</td>
                  <td>
                    <button
                      className="btn btn-info"
                      onClick={() => handleEdit(item)}
                    >
                      Edit
                    </button>{" "}
                    <button
                      className="btn btn-danger"
                      onClick={() => handleDelete(item)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div>
            <p className="text-danger text-center">Data not found....</p>
          </div>
        )}
      </main>
    </>
  );
}

export default App;
