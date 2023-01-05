import Grid from "@mui/material/Grid";
import { experimentalStyled as styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import {
  tokenExchange,
  editEvent,
  loginWithGoogle,
  getEvents,
  deleteEvent,
} from "./api";
import CachedIcon from "@mui/icons-material/Cached";
import GoogleIcon from "@mui/icons-material/Google";
import Tooltip from "@mui/material/Tooltip";
import Alert from "@mui/material/Alert";
import CheckIcon from "@mui/icons-material/Check";
import PriorityHighIcon from "@mui/icons-material/PriorityHigh";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import CancelIcon from "@mui/icons-material/Cancel";
import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import styles from "./Planner.module.css";
import { useMemo } from "react";
import _ from "lodash";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

export default function Planner() {
  const [groupedEvents, setGroupedEvents] = useState({});
  const [isLogged, setIsLogged] = useState(false);
  const [statusMessage, setStatusMessage] = useState();
  const [modalEditEvent, setModalEditEvent] = useState(false);
  const [modalDeleteEvent, setModalDeleteEvent] = useState(false);
  const [recipeDate, setRecipeDate] = useState("");
  const [recipeHour, setRecipeHour] = useState("");
  const [selectedIdEvent, setSelectedIdEvent] = useState("");
  const [error, setError] = useState({ date: "" });

  useEffect(() => {
    getCurrentEvents();
  }, []);

  useEffect(() => {
    const url = window.location.href;
    const params = new URLSearchParams(url);
    const code = params.get("code");
    if (code) {
      getAccessAndRefreshToken(code);
    }
  }, []);

  const getCurrentEvents = useMemo(() => {
    return () => {
      getEvents().then((res) => {
        setIsLogged(res.data["isLogged"]);
        const eventsByDay = _.groupBy(res.data["events"], (event) => {
          return new Date(event.timestamp * 1000).toLocaleDateString();
        });
        const sortedEvents = _.sortBy(eventsByDay, (event) => {
          return event[0].timestamp;
        });
        setGroupedEvents(sortedEvents);
      });
    };
  }, []);

  const getAccessAndRefreshToken = async (code) => {
    const response = await tokenExchange(code);
    let refreshToken = response.data.refresh_token;
    window.history.replaceState({}, document.title, "/planner");
    await loginWithGoogle(refreshToken);
    getCurrentEvents();
  };

  const getOauth2Code = () => {
    const url = `https://accounts.google.com/o/oauth2/v2/auth?scope=${process.env.NEXT_PUBLIC_SCOPE}&access_type=offline&include_granted_scopes=true&response_type=code&state=code&redirect_uri=${process.env.NEXT_PUBLIC_REDIRECT_URI}&client_id=${process.env.NEXT_PUBLIC_CLIENT_ID}`;
    window.location.href = url;
  };

  const syncEvent = async (event) => {
    const response = await editEvent(event.id, event.timestamp, true);
    getCurrentEvents();
    showOperationStatus(response.status);
  };

  const editCurrentEvent = () => {
    let timestamp = new Date(recipeDate).getTime() / 1000;
    if (recipeHour === "Breakfast") {
      timestamp += 8 * 60 * 60;
    } else if (recipeHour === "Lunch") {
      timestamp += 13 * 60 * 60;
    } else if (recipeHour === "Dinner") {
      timestamp += 20 * 60 * 60;
    }

    editEvent(selectedIdEvent, timestamp, false)
      .then((response) => {
        showOperationStatus(response.status);
        getCurrentEvents();
      })
      .catch((error) => {
        if (error.response.status === 400) {
          setError({ date: "Invalid date" });
        }
      });

    setModalEditEvent(false);
    setRecipeDate("");
    setRecipeHour("");
    setSelectedIdEvent("");
  };

  const openEditModal = (event) => {
    setModalEditEvent(true);
    setSelectedIdEvent(event.id);
    setRecipeDate(
      new Date(event.timestamp * 1000).toLocaleDateString("en-CA", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      })
    );
    const hour = new Date(event.timestamp * 1000).getHours();
    if (hour === 9) {
      setRecipeHour("Breakfast");
    } else if (hour === 14) {
      setRecipeHour("Lunch");
    } else if (hour === 21) {
      setRecipeHour("Dinner");
    }
  };

  const openDeleteModal = (eventId) => {
    setModalDeleteEvent(true);
    setSelectedIdEvent(eventId);
  };

  const deleteCurrentEvent = () => {
    deleteEvent(selectedIdEvent).then((response) => {
      showOperationStatus(response.status);
      getCurrentEvents();
    });
    setModalDeleteEvent(false);
    setSelectedIdEvent("");
  };

  const showOperationStatus = (status) => {
    const icon =
      status === 200 || status === 204 ? (
        <CheckIcon className={styles.icon} />
      ) : (
        <PriorityHighIcon className={styles.icon} />
      );
    const children =
      status === 200 || status === 204
        ? "Operation completed successfully"
        : "Operation failed";
    setStatusMessage(
      <Alert
        onClose={() => {
          setStatusMessage();
        }}
        className={styles.alert}
        icon={icon}
        children={children}
      />
    );
  };

  const validateField = (setError, data, field) => {
    let today = new Date().toLocaleDateString("en-CA", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
    if (data < today) {
      setError((prev) => ({
        ...prev,
        [field]: "Date must be greater than today",
      }));
    } else if (isNaN(new Date(data).getTime())) {
      setError((prev) => ({
        ...prev,
        [field]: "Invalid date format",
      }));
    } else {
      setError((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
    setRecipeDate(data);
  };

  return (
    <>
      {!isLogged ? (
        <div className={styles.container}>
          <Tooltip
            title="Login with Google to sync your events with your calendar"
            arrow
            placement="top"
          >
            <Button
              onClick={getOauth2Code}
              className={styles.button}
              variant="contained"
              disabled={isLogged}
            >
              Login with Google
              <GoogleIcon className={styles.googleIcon} />
            </Button>
          </Tooltip>
        </div>
      ) : (
        ""
      )}
      {Object.keys(groupedEvents).map((date, id) => (
        <Grid item xs={12} padding={"20px"} key={id}>
          <h1>
            {new Date(groupedEvents[date][0].timestamp * 1000).toDateString()}
          </h1>
          <Grid
            container
            spacing={{ xs: 1, md: 3 }}
            columns={{ xs: 4, sm: 8, md: 12 }}
          >
            {groupedEvents[date].map((event, id) => (
              <Grid item xs={12} sm={4} md={4} key={id}>
                <Item className={styles.item}>
                  <div className={styles.card}>
                    {!event.synced && isLogged ? (
                      <Tooltip
                        title="Syncronize this event with Google Calendar"
                        arrow
                        placement="top"
                      >
                        <Button
                          onClick={() => syncEvent(event)}
                          className={styles.actionButton}
                        >
                          <CachedIcon />
                        </Button>
                      </Tooltip>
                    ) : (
                      ""
                    )}
                    {!event.synced ? (
                      <Tooltip title="Edit this event" arrow placement="top">
                        <Button
                          onClick={() => openEditModal(event)}
                          className={styles.actionButton}
                        >
                          <EditIcon />
                        </Button>
                      </Tooltip>
                    ) : (
                      ""
                    )}
                    <Tooltip title="Delete this event" arrow placement="top">
                      <Button
                        onClick={() => openDeleteModal(event.id)}
                        className={styles.actionButton}
                      >
                        <DeleteIcon />
                      </Button>
                    </Tooltip>
                  </div>
                  <h2>{event.recipe.name}</h2>
                  <p>{event.recipe.description}</p>
                  <p>{event.recipe.ingredients[0].name}</p>
                  <p>{event.recipe.ingredients[1].name}</p>
                </Item>
              </Grid>
            ))}
          </Grid>
        </Grid>
      ))}
      {statusMessage}
      <Modal open={modalEditEvent} onClose={() => setModalEditEvent(false)}>
        <Box bgcolor={"white"} className={styles.modal}>
          <div>
            <div className={styles.modalHeader}>
              <div style={{ width: "100%" }}>
                <img src="/small-logo.png" alt="logo" className={styles.logo} />
                <p>When do you want to cook this recipe?</p>
                <TextField
                  size="small"
                  label="Date"
                  variant="outlined"
                  type={"date"}
                  InputLabelProps={{ shrink: true }}
                  className={styles.input}
                  value={recipeDate}
                  onChange={(e) =>
                    validateField(setError, e.target.value, "date")
                  }
                  error={error.date.length > 0 ? true : false}
                  helperText={error.date}
                />
                <p>What time?</p>
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">Time</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    label="Time"
                    value={recipeHour}
                    onChange={(e) => setRecipeHour(e.target.value)}
                  >
                    <MenuItem value={"Breakfast"}>Breakfast</MenuItem>
                    <MenuItem value={"Lunch"}>Lunch</MenuItem>
                    <MenuItem value={"Dinner"}>Dinner</MenuItem>
                  </Select>
                </FormControl>
              </div>
            </div>
            <Button
              className={styles.confirmButton}
              disabled={error.date.length > 0 ? true : false}
              onClick={() => editCurrentEvent()}
            >
              <EditIcon className={styles.buttonIcon} />
              Edit
            </Button>
            <Button
              className={styles.cancelButton}
              onClick={() => setModalEditEvent(false)}
            >
              <CancelIcon className={styles.buttonIcon} /> Cancel
            </Button>
          </div>
        </Box>
      </Modal>
      <Modal open={modalDeleteEvent} onClose={() => setModalDeleteEvent(false)}>
        <Box bgcolor={"white"} className={styles.modal}>
          <div>
            <div className={styles.modalHeader}>
              <div style={{ width: "100%" }}>
                <img src="/small-logo.png" alt="logo" className={styles.logo} />
                <p>Are you sure you want to delete this event?</p>
              </div>
            </div>
            <Button
              className={styles.confirmButton}
              onClick={() => deleteCurrentEvent()}
            >
              <DeleteIcon className={styles.buttonIcon} /> Delete
            </Button>
            <Button
              className={styles.cancelButton}
              onClick={() => setModalDeleteEvent(false)}
            >
              <CancelIcon className={styles.buttonIcon} /> Cancel
            </Button>
          </div>
        </Box>
      </Modal>
    </>
  );
}
