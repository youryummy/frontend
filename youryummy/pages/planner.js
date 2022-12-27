import Grid from "@mui/material/Grid";
import { experimentalStyled as styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import { tokenExchange, syncWithCalendar, loginWithGoogle } from "./api";
import { events } from "./utils/events";
import CachedIcon from "@mui/icons-material/Cached";
import GoogleIcon from "@mui/icons-material/Google";
import Tooltip from "@mui/material/Tooltip";

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

  useEffect(() => {
    //TODO events should be fetched from the backend and have to contain the events from today and if the user is logged in
    setIsLogged(events["logged"]);
    const groupedEventsByDay = events["events"].reduce((acc, event) => {
      const date = new Date(event.timestamp * 1000).toDateString();
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(event);
      return acc;
    }, {});
    setGroupedEvents(groupedEventsByDay);
  }, []);

  useEffect(() => {
    const url = window.location.href;
    const params = new URLSearchParams(url);
    const code = params.get("code");
    if (code) {
      getAccessAndRefreshToken(code);
    }
  }, []);

  const getAccessAndRefreshToken = async (code) => {
    const response = await tokenExchange(code);
    let refreshToken = response.data.refresh_token;
    window.history.replaceState({}, document.title, "/planner");
    let res = loginWithGoogle(refreshToken);
    if (res) {
      setIsLogged(true);
    }
  };

  const getOauth2Code = () => {
    const url = `https://accounts.google.com/o/oauth2/v2/auth?scope=${process.env.NEXT_PUBLIC_SCOPE}&access_type=offline&include_granted_scopes=true&response_type=code&state=code&redirect_uri=${process.env.NEXT_PUBLIC_REDIRECT_URI}&client_id=${process.env.NEXT_PUBLIC_CLIENT_ID}`;
    window.location.href = url;
  };

  const syncEvent = async () => {
    const response = await syncWithCalendar(
      "228ca39118e14db3906b72e8dc0ec11c",
      "1633043200",
      true
    );
  };

  return (
    <>
      {!isLogged ? (
        <div
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "flex-end",
            padding: "20px",
          }}
        >
          <Tooltip
            title="Login with Google to sync your events with your calendar"
            arrow
            placement="top"
          >
            <Button
              onClick={getOauth2Code}
              style={{ backgroundColor: "#772318" }}
              variant="contained"
              disabled={isLogged}
            >
              Login with Google
              <GoogleIcon style={{ marginLeft: "5px" }} />
            </Button>
          </Tooltip>
        </div>
      ) :
        ""
      }
      {Object.keys(groupedEvents).map((date, id) => (
        <Grid item xs={12} padding={"20px"} key={id}>
          <h1>{date}</h1>
          <Grid
            container
            spacing={{ xs: 1, md: 3 }}
            columns={{ xs: 4, sm: 8, md: 12 }}
          >
            {groupedEvents[date].map((event, id) => (
              <Grid item xs={12} sm={4} md={4} key={id}>
                <Item style={{ borderRadius: "20px", height: "350px" }}>
                  <div
                    style={{
                      width: "100%",
                      display: "flex",
                      justifyContent: "flex-end",
                    }}
                  >
                    {isLogged ? (
                      <Tooltip
                        title="Syncronize this event with Google Calendar"
                        arrow
                        placement="top"
                      >
                        <Button onClick={syncEvent} style={{ color: "#772318" }}>
                          Sync
                          <CachedIcon />
                        </Button>
                      </Tooltip>
                    ) :
                      ""
                    }
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
    </>
  );
}
