import Grid from "@mui/material/Grid";
import { experimentalStyled as styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Button from "@mui/material/Button";
import {
    getRecipe,
    editRecipe,
    getRecipes,
    deleteRecipe,
} from "./api";
import { useRouter } from "next/router";
import { CardActionArea } from '@mui/material';
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import CardMedia from '@mui/material/CardMedia';

import styles from "./Recipes.module.css";
import { useMemo } from "react";
import CheckIcon from "@mui/icons-material/Check";
import PriorityHighIcon from "@mui/icons-material/PriorityHigh";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CancelIcon from "@mui/icons-material/Cancel";
import Tooltip from "@mui/material/Tooltip";
import Alert from "@mui/material/Alert";
import {recipes} from "./utils/recipes";

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
    ...theme.typography.body2,
    padding: theme.spacing(2),
    textAlign: "center",
    color: theme.palette.text.secondary,
}));
export default function Home() {
    const router = useRouter();
    const [recommendedRecipes, setRecommendedRecipes] = useState({});
    const [isLogged, setIsLogged] = useState(false);
    const [statusMessage, setStatusMessage] = useState();
    const [modalViewRecipe, setModalViewRecipe] = useState(false);
    const [modalEditRecipe, setModalEditRecipe] = useState(false);
    const [modalDeleteRecipe, setModalDeleteRecipe] = useState(false);
    const [selectedIdRecipe, setSelectedIdRecipe] = useState("");
    const [error, setError] = useState({ date: "" });
    const dispatch = useDispatch();
    const { username } = router.query;

    useEffect(() => {
        getCurrentRecipes();
    }, []);

    const getCurrentRecipes = useMemo(() => {
        return () => {
            getRecipes().then((res) => {

                setRecommendedRecipes(res.data);
            });
        };
    }, []);


    const editCurrentEvent = () => {

        editRecipe(selectedIdRecipe, timestamp, false)
            .then((response) => {
                showOperationStatus(response.status);
                getCurrentRecipes();
                setModalEditRecipe(false);
                setSelectedIdRecipe("");
            })
            .catch((error) => {
                if (error.response.status === 400) {
                    setError({ date: error.response.data["message"] });
                    return;
                }
            });
    };

    const openEditModal = (event) => {
        setModalEditRecipe(true);
        setSelectedIdRecipe(event.id);

    };

    const openDeleteModal = (recipeId) => {
        setModalDeleteRecipe(true);
        setSelectedIdRecipe(recipeId);
    };

    const deleteCurrentRecipe = () => {
        deleteRecipe(selectedIdRecipe).then((response) => {
            showOperationStatus(response.status);
            getCurrentRecipes();
        });
        setModalDeleteRecipe(false);
        setSelectedIdRecipe("");
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
    };

    const cancelActionButton = () => {
        setModalEditRecipe(false)
    }

    return (
        <>
            <Grid container padding={"20px"} spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
                {Array.from([recipes]).map((recipe, index) => (
                    <Grid item xs={2} sm={4} md={4} key={index} onClick={()=> console.log("Hola")}>
                        <Item className={styles.item}>
                            <div className={styles.card}>
                                <CardActionArea onClick={() => setModalViewRecipe(true)}>
                                    <CardMedia
                                        component="img"
                                        alt=""
                                        height="200"
                                        image={recipe.imageUrl}
                                    />
                                </CardActionArea>

                            </div>
                            <h2>{recipe.name}</h2>

                        </Item>
                    </Grid>
                ))}
            </Grid>
            {statusMessage}
            <Modal open={modalEditRecipe} onClose={() => setModalEditRecipe(false)}>
                <Box bgcolor={"white"} className={styles.modal}>
                    <div>
                        <div className={styles.modalHeader}>
                            <div style={{ width: "100%" }}>
                                <img src="/small-logo.png" alt="logo" className={styles.logo} />
                                  <p>What time?</p>
                                <FormControl fullWidth>

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
                            onClick={() => cancelActionButton()}
                        >
                            <CancelIcon className={styles.buttonIcon} /> Cancel
                        </Button>
                    </div>
                </Box>
            </Modal>
            <Modal open={modalDeleteRecipe} onClose={() => setModalDeleteRecipe(false)}>
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
                            onClick={() => deleteCurrentRecipe()}
                        >
                            <DeleteIcon className={styles.buttonIcon} /> Delete
                        </Button>
                        <Button
                            className={styles.cancelButton}
                            onClick={() => setModalDeleteRecipe(false)}
                        >
                            <CancelIcon className={styles.buttonIcon} /> Cancel
                        </Button>
                    </div>
                </Box>
            </Modal>
            <Modal open={modalViewRecipe} onClose={() => setModalViewRecipe(false)}>
                <Box bgcolor={"white"} className={styles.modalView}>
                    <div>

                        <Button
                            className={styles.cancelButton}
                            onClick={() => setModalViewRecipe(false)}
                        >
                            <CancelIcon className={styles.buttonIcon} /> Cancel
                        </Button>
                    </div>
                </Box>
            </Modal>


        </>
    );
}