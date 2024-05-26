import React, { useState, useEffect } from "react";
import image from "./assets/image.png";
import addButton from "./assets/addButton.png";
import detective from "./assets/detective.png";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import Input from "@mui/material/Input";

import List from "./List";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const addButtonStyle = {
  borderRadius: "50%",
  width: "80px",
  height: "80px",
  background: "#6C63FF",
  cursor: "pointer",
  transition: "var(--transition)",
  float: "right",
  marginTop: "5rem",
};

const getLocalStorage = () => {
  let list = localStorage.getItem("list");
  if (list) {
    return (list = JSON.parse(localStorage.getItem("list")));
  } else {
    return [];
  }
};
function App() {
  const [name, setName] = useState("");
  const [list, setList] = useState(getLocalStorage());
  const [isEditing, setIsEditing] = useState(false);
  const [editID, setEditID] = useState(null);
  const [alert, setAlert] = useState({ show: false, msg: "", type: "" });

  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [isDarkTheme, setIsDarkTheme] = useState(false);

  const toggleTheme = () => {
    setIsDarkTheme((prevTheme) => !prevTheme);
  };

  useEffect(() => {
    document.body.style.backgroundColor = isDarkTheme ? "#252525" : "#fff";
    const elements = document.getElementsByClassName("title");

    const h3s = document.querySelectorAll(".list-form h3");

    for (const h3 of h3s) {
      h3.style.color = isDarkTheme ? "#fff" : "#252525";
    }

    for (const element of elements) {
      element.style.color = isDarkTheme ? "#fff" : "#252525";
    }
  }, [isDarkTheme]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name) {
      showAlert(true, "danger", "please enter value");
      return;
    } else if (name && isEditing) {
      setList(
        list.map((item) => {
          if (item.id === editID) {
            return { ...item, title: name };
          }
          return item;
        })
      );
      setName("");
      setEditID(null);
      setIsEditing(false);
      showAlert(true, "success", "value changed");
    } else {
      showAlert(true, "success", "item added to the list");
      const newItem = { id: new Date().getTime().toString(), title: name };

      setList([...list, newItem]);
      setName("");
    }
    handleClose();
  };

  const showAlert = (show = false, type = "", msg = "") => {
    setAlert({ show, type, msg });
  };

  const removeItem = (id) => {
    showAlert(true, "danger", "item removed");
    setList(list.filter((item) => item.id !== id));
  };
  const editItem = (id) => {
    const specificItem = list.find((item) => item.id === id);
    setIsEditing(true);
    setEditID(id);
    setName(specificItem.title);
  };
  useEffect(() => {
    localStorage.setItem("list", JSON.stringify(list));
  }, [list]);

  return (
    <>
      <section className="section-center ">
        <div className="list-form">
          <h3>TODO LIST</h3>
          <div className="form-control">
            <input
              type="text"
              className="input"
              placeholder="Search note..."
              // value={name}
              // onChange={(e) => setName(e.target.value)}
            />
            <div className="filter-btn">
              <select className="select">
                <option value="ALL">ALL</option>
                <option value="Complete">Complete</option>
                <option value="Incomplete">Incomplete</option>
              </select>
            </div>

            <button className="mode">
              <img
                className="nightLogo"
                src={image}
                onClick={toggleTheme}
              ></img>
            </button>
          </div>
        </div>
        {list.length === 0 ? (
          <div className="detectiveImageDiv">
            <img className="detectiveImage" src={detective}></img>
          </div>
        ) : (
          <div className="list-container">
            <List items={list} removeItem={removeItem} editItem={editItem} />
          </div>
        )}

        <Button onClick={handleOpen} sx={addButtonStyle}>
          <img className="addImage" src={addButton}></img>
        </Button>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              New Note
            </Typography>
            <Input
              placeholder="Enter your note here"
              fullWidth
              sx={{ mt: 2, mb: 2 }}
              onChange={(e) => setName(e.target.value)}
            />
            <Box
              sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}
            >
              <Button
                variant="contained"
                sx={{
                  backgroundColor: "white",
                  color: "black",
                  border: "1px solid #6C63FF",
                }}
                onClick={handleClose}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                sx={{ backgroundColor: "#6C63FF", color: "white" }}
                onClick={handleSubmit}
              >
                Apply
              </Button>
            </Box>
          </Box>
        </Modal>
      </section>
    </>
  );
}

export default App;
