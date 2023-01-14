import * as React from 'react';
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';
import MuiAccordion from '@mui/material/Accordion';
import MuiAccordionSummary from '@mui/material/AccordionSummary';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import Chip from '@mui/material/Chip';
import Grid from "@mui/material/Grid";
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import TextField from '@mui/material/TextField';
import Divider from '@mui/material/Divider';
import Fab from '@mui/material/Fab';
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
    getRecommendations,
    postRecipe,
} from "./api";
import { useRouter } from "next/router";
import { CardActionArea } from '@mui/material';
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import Stack from '@mui/material/Stack';
import styles from "./Recipes.module.css";
import UploadImage from '../../components/UploadImage';
import { useMemo } from "react";
import { useSelector } from "react-redux";
import CheckIcon from "@mui/icons-material/Check";
import PriorityHighIcon from "@mui/icons-material/PriorityHigh";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CancelIcon from "@mui/icons-material/Cancel";
import RemoveIcon from '@mui/icons-material/Remove';
import CommentIcon from '@mui/icons-material/Comment';
import AddIcon from '@mui/icons-material/Add';
import Tooltip from "@mui/material/Tooltip";
import Alert from "@mui/material/Alert";
import CommentsList from "../../components/Comments/CommentsList";


const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
    ...theme.typography.body2,
    padding: theme.spacing(2),
    textAlign: "center",
    color: theme.palette.text.secondary,
}));
export default function Home() {
    const [recommendedRecipes, setRecommendedRecipes] = useState({});

    const [statusMessage, setStatusMessage] = useState();
    const [modalViewRecipe, setModalViewRecipe] = useState(false);
    const [modalCommentsRecipe, setModalCommentsRecipe] = useState(false);
    const [modalEditRecipe, setModalEditRecipe] = useState(false);
    const [modalDeleteRecipe, setModalDeleteRecipe] = useState(false);
    const [modalPostRecipe, setModalPostRecipe] = useState(false);
    const [selectedIdRecipe, setSelectedIdRecipe] = useState("");
    const [selectedRecipe, setSelectedRecipe] = useState("");
    const [recipeToPost, setRecipeToPost] = useState("");
    const [selectedEditRecipe, setSelectedEditRecipe] = useState("");
    const [recommendedIds, setRecommendedIds] = useState("");

    const [error, setError] = useState({ date: "" });
    const dispatch = useDispatch();
    const [expanded, setExpanded] = React.useState('panel1');
    const handleChange = (panel) => (event, newExpanded) => {
        setExpanded(newExpanded ? panel : false);
    };
    const [stepsList, setStepsList] = useState([""]);
    const [tagsList, setTagsList] = useState([""]);

    const handleStepsRemove = (index) => {
        const list = [...stepsList];
        list.splice(index, 1);
        setStepsList(list);
    };

    const handleStepsAdd = () => {
        setStepsList([...stepsList, '']);
    };

    const handleTagsRemove = (index) => {
        const list = [...tagsList];
        list.splice(index, 1);
        setTagsList(list);
    };

    const handleTagsAdd = () => {
        setTagsList([...tagsList, '']);
    };

    const handleChangeTags = (index, evnt)=>{    
        const { name, value } = evnt.target;
        const list = [...tagsList];
        list[index] = value;
        setTagsList(list);      
    }

    const handleChangeSteps = (index, evnt)=>{    
        const { name, value } = evnt.target;
        const list = [...stepsList];
        list[index] = value;
        setStepsList(list);      
    }
    const Accordion = styled((props) => (
        <MuiAccordion disableGutters elevation={0} square {...props} />
    ))(({ theme }) => ({
        border: `1px solid ${theme.palette.divider}`,
        '&:not(:last-child)': {
            borderBottom: 0,
        },
        '&:before': {
            display: 'none',
        },
    }));
    
    const AccordionSummary = styled((props) => (
        <MuiAccordionSummary
            expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: '0.9rem' }} />}
            {...props}
        />
    ))(({ theme }) => ({
        backgroundColor:
            theme.palette.mode === 'dark'
                ? 'rgba(255, 255, 255, .05)'
                : 'rgba(0, 0, 0, .03)',
        flexDirection: 'row-reverse',
        '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
            transform: 'rotate(90deg)',
        },
        '& .MuiAccordionSummary-content': {
            marginLeft: theme.spacing(1),
        },
    }));
    
    const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
        padding: theme.spacing(2),
        borderTop: '1px solid rgba(0, 0, 0, .125)',
    }));

    const tokenUsername = useSelector((state) => state.token?.username);
    const tokenPlan = useSelector((state) => state.token?.plan);

    useEffect(() => {
        
        getRecommendedRecipes();

    }, []);

    const setField = (setData, data, field) => {
        setData((prev) => ({...prev, [field]: data}));
    }

    const getRecommendedRecipes = useMemo(() => {
        return () => {           
                getRecommendations(tokenUsername,tokenPlan).then((response) => {
                    setRecommendedIds(response.data)
                    getRecipes().then((res) => {
                       setRecommendedRecipes(Array.from(res.data)
                       .filter(student => response.data.includes(student._id)))});
                });
        };
    }, []);


    const postThisRecipe = () => {
        recipeToPost.steps = stepsList
        recipeToPost.tags = tagsList 
        recipeToPost.duration = parseInt(recipeToPost.duration)
        console.log(recipeToPost)
        postRecipe(recipeToPost)
            .then((response) => {
                showOperationStatus(response.status);
                getRecommendedRecipes();
                
            })
            .catch((error) => {
                if (error.response?.status === 400) {
                    setError({ date: error.response.data["message"] });
                    return;
                }
            });
        setModalPostRecipe(false);
        setTagsList([""]);
        setStepsList([""]);
        setRecipeToPost("");
    };

    const editCurrentEvent = () => {
        selectedEditRecipe.steps = stepsList
        selectedEditRecipe.tags = tagsList
        selectedEditRecipe.duration = parseInt(selectedEditRecipe.duration) 
        editRecipe(selectedEditRecipe)
            .then((response) => {
                showOperationStatus(response.status);
                getRecommendedRecipes();
                
            })
            .catch((error) => {
                if (error.response?.status === 400) {
                    setError({ date: error.response.data["message"] });
                    return;
                }
            });
        setModalEditRecipe(false);
        setTagsList([""]);
        setStepsList([""]);
        setSelectedIdRecipe("");
    };

    const openEditModal = (recipe) => {
        setSelectedIdRecipe(recipe._id);
        setTagsList(recipe.tags);
        setStepsList(recipe.steps)
        viewEditRecipe(recipe._id);
        setModalEditRecipe(true);

    };

    const openPostModal = () => {
        setModalPostRecipe(true);
    };

    const openViewModal = (recipe) => {
        setSelectedIdRecipe(recipe._id);
        viewCurrentRecipe(recipe._id);
        setModalViewRecipe(true);


    };

    const openCommentsModal = () => {
        setModalCommentsRecipe(true);
    };

    const openDeleteModal = (recipeId) => {
        setModalDeleteRecipe(true);
        setSelectedIdRecipe(recipeId);
    };
    
    const viewCurrentRecipe = (id)=> {
        getRecipe(id).then((response) => {
            showOperationStatus(response.status);
            setSelectedRecipe(response.data)

        });
    };

    const viewEditRecipe = (id)=> {
        getRecipe(id).then((response) => {
            showOperationStatus(response.status);
            setSelectedEditRecipe(response.data)

        });
    };
    
    const deleteCurrentRecipe = () => {
        deleteRecipe(selectedIdRecipe).then((response) => {
            showOperationStatus(response.status);
            getRecommendedRecipes();
        });
        setModalDeleteRecipe(false);
        setSelectedIdRecipe("");
    };

    const showOperationStatus = (status) => {
        const icon =
            status === 200 || status === 204 || status === 201 ? (
                <CheckIcon className={styles.icon} />
            ) : (
                <PriorityHighIcon className={styles.icon} />
            );
        const children =
            status === 200 || status === 204 || status === 201
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

    const validateField = (setData, setError, data, field) => {
        switch (field) {
            case "name":
                if (data.length === 0) setError((prev) => ({...prev, [field]: "Cannot be empty"}));
                else setError((prev) => ({...prev, [field]: ""}));
                break;
            case "duration":
                if (data.length === 0) setError((prev) => ({...prev, [field]: "Cannot be empty"}));
                if (parseInt(data) < 0) setError((prev) => ({...prev, [field]: "Duration must be greater than zero"}));
                else setError((prev) => ({...prev, [field]: ""}));
                break;
            case "summary":
                if (data.length === 0) setError((prev) => ({...prev, [field]: "Cannot be empty"}));
                else setError((prev) => ({...prev, [field]: ""}));
                break;
    
        }
        setField(setData, data, field);
    };

    const cancelActionButton = () => {
        setModalEditRecipe(false)
    }


    return (
        <>
            <Grid container padding={"20px"} spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
                {Array.from(recommendedRecipes).map((recipe, index) => (
                    <Grid item xs={2} sm={4} md={4} key={index}>
                        <Item className={styles.item}>
                            <div className={styles.card}>
                                <CardActionArea onClick={() => openViewModal(recipe)}>
                                    <CardMedia
                                        component="img"
                                        alt=""
                                        height="200"
                                        image={recipe.imageUrl}
                                    />
                                </CardActionArea>

                            </div>
                            <Tooltip title="Add a Recipe" arrow placement="top">
                      <Button
                        onClick={() => openPostModal()}
                        className={styles.actionButton}
                      >
                        <AddIcon />
                      </Button>
                    </Tooltip>
                            {recipe.createdBy==tokenUsername ? ("") :
                            <Tooltip title="Edit this recipe" arrow placement="top">
                        <Button
                          onClick={() => openEditModal(recipe)}
                          className={styles.actionButton}
                        >
                          <EditIcon />
                        </Button>
                      </Tooltip>
                      }
                      {recipe.createdBy==tokenUsername ? ("") :
                      <Tooltip title="Delete this recipe" arrow placement="top">
                      <Button
                        onClick={() => openDeleteModal(recipe._id)}
                        className={styles.actionButton}
                      >
                        <DeleteIcon />
                      </Button>
                    </Tooltip>
                    }
                    
                    <Tooltip title="Recipe's comments" arrow placement="top">
                      <Button
                        onClick={() => openCommentsModal()}
                        className={styles.actionButton}
                      >
                        <CommentIcon />
                      </Button>
                    </Tooltip>
                    
                            <h2>{recipe.name}</h2>

                        </Item>
                    </Grid>
                ))}
            </Grid>
            {statusMessage}
            {(selectedEditRecipe=="") ? (""):
            <Modal open={modalEditRecipe} onClose={() => setModalEditRecipe(false)}>
                <Box bgcolor={"white"} className={styles.modal}>
                    <div>
                        <div className={styles.modalHeader}>
                            <div style={{ width: "100%" }}>
                                <img src="/small-logo.png" alt="logo" className={styles.logo} />
                                <FormControl fullWidth>
                                    <Divider textAlign="left">Recipe</Divider>
                                    <UploadImage data={selectedEditRecipe} setData={setSelectedEditRecipe} d={200}/>

                                    <TextField fullWidth label="Name" margin="normal" value={selectedEditRecipe.name} onChange={(e) =>
                    validateField(setSelectedEditRecipe,setError, e.target.value, "name")
                  }/>
                                    <TextField fullWidth label="Duration" margin="normal" value={selectedEditRecipe.duration} onChange={(e) =>
                    validateField(setSelectedEditRecipe,setError, e.target.value, "duration")
                  }/>
                                    <TextField fullWidth label="Summary" margin="normal" value={selectedEditRecipe.summary} onChange={(e) =>
                    validateField(setSelectedEditRecipe,setError, e.target.value, "summary")
                  }/>
                                    &nbsp;
                            <Divider textAlign="left">Tags</Divider>
                            {
                                tagsList.map((tag, index) => (

                                    <div key={index} className="services">
                                        <TextField fullWidth label={"Tag "+(index+1)} margin="normal" value={tag} onChange={(evnt)=>handleChangeTags(index, evnt)}/>
                                        {tagsList.length - 1 === index && tagsList.length < 15 && (

                                            <Fab sx={{margin:'0px 14px 0px 0px'}} size="small" color="primary" aria-label="add" onClick={handleTagsAdd}>
                                                <AddIcon />
                                            </Fab>
                                        )}
                                        {tagsList.length !== 1 && (
                                            <Fab size="small" color="primary" aria-label="add" onClick={() => handleTagsRemove(index)}>
                                                <RemoveIcon />
                                            </Fab>

                                        )}
                                    </div>
                                ))}
                            &nbsp;
                            <Divider textAlign="left">Steps</Divider>
                            {
                                stepsList.map((step, index) => (

                                    <div key={index} className="services">
                                        <TextField fullWidth label={"Step "+(index+1)} margin="normal" value={step} onChange={(evnt)=>handleChangeSteps(index, evnt)
                  }/>
                                        {stepsList.length - 1 === index && stepsList.length < 15 && (

                                            <Fab sx={{margin:'0px 14px 0px 0px'}} size="small" color="primary" aria-label="add" onClick={handleStepsAdd}>
                                                <AddIcon />
                                            </Fab>
                                        )}
                                        {stepsList.length !== 1 && (
                                            <Fab size="small" color="primary" aria-label="add" onClick={() => handleStepsRemove(index)}>
                                                <RemoveIcon />
                                            </Fab>

                                        )}
                                    </div>
                                ))}

                                </FormControl>
                            </div>
                        </div>
                        <Button
                            className={styles.confirmButton}
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
            </Modal>}

            <Modal open={modalDeleteRecipe} onClose={() => setModalDeleteRecipe(false)}>
                <Box bgcolor={"white"} className={styles.modalDelete}>
                    <div>
                        <div className={styles.modalHeader}>
                            <div style={{ width: "100%" }}>
                                <img src="/small-logo.png" alt="logo" className={styles.logo} />
                                <Typography gutterBottom variant="body" component="div">
                                Are you sure you want to delete this event?
                            </Typography>
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
            {(selectedRecipe=="") ? (""):
            <Modal open={modalViewRecipe} onClose={() => {setModalViewRecipe(false);setSelectedRecipe("");setSelectedIdRecipe("");setSelectedEditRecipe("")}}>
                <Box bgcolor={"white"} className={styles.modalView}>
                    <div>

                        <Button
                            className={styles.cancelButton}
                            onClick={() => setModalViewRecipe(false)}
                        >
                            <CancelIcon className={styles.buttonIcon} /> Cancel
                        </Button>
                    </div>
                    <Box
        >
        <Paper
            sx={{
                p: 2,
                margin: '63px 0px 0px 69px',
                maxWidth: 1300,
                flexGrow: 1,
                backgroundColor: (theme) =>
                    theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
            }}
        >
            <Grid container spacing={2} >
                <Grid item sx={{margin:'14px 0px 0px 0px'}} >
                        <CardMedia
                            component="img"
                            alt=""
                            height="200"
                            image={selectedRecipe.imageUrl}
                        />
                </Grid>
                <Grid item xs={12} sm container>
                    <Grid item xs container direction="column" spacing={2}>
                        <Grid item xs>
                            <Typography gutterBottom variant="subtitle1" component="div">
                                {selectedRecipe.name}
                            </Typography>
                            <Typography variant="body2" gutterBottom>
                                by {selectedRecipe.createdBy} • <AccessTimeIcon fontSize="inherit" /> {selectedRecipe.duration} min
                            </Typography>
                            <Stack direction="row" spacing={1}>
                            <div>
            <Accordion expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
                <AccordionSummary aria-controls="panel1d-content" id="panel1d-header">
                    <Typography>Tags</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    {(selectedRecipe.tags.length!=0) ? ("") : selectedRecipe.tags.map((item) => (
                        <Chip sx={{margin:'0px 19px 0px 0px'}} label={item} variant="outlined" />
                    ))}
                </AccordionDetails>
            </Accordion>
            <Accordion expanded={expanded === 'panel2'} onChange={handleChange('panel2')}>
                <AccordionSummary aria-controls="panel2d-content" id="panel2d-header">
                    <Typography>Summary</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography>
                        {selectedRecipe.summary}
                    </Typography>
                </AccordionDetails>
            </Accordion>

        </div>
                            </Stack>
                        </Grid>

                    </Grid>
                    <Grid item>

                    </Grid>
                </Grid>
            </Grid>

        </Paper>
            <Paper
                sx={{
                    p: 2,
                    margin: '63px 0px 0px 69px',
                    maxWidth: 500,
                    flexGrow: 1,
                    backgroundColor: (theme) =>
                        theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
                }}
            >
                <Grid container>
                    <Grid item xs>
                    <List
            sx={{
                width: '100%',
                maxWidth: 500,
                bgcolor: 'background.paper',
                position: 'relative',
                overflow: 'auto',
                maxHeight: 150,
                '& ul': { padding: 0 },
            }}
            subheader={<li />}
        >
            <Divider textAlign="left" sx={{width:'418px'}}>Steps</Divider>

            {selectedRecipe.steps.map((sectionId,index) => (
                <li key={`section-${index}`}>
                    <ul>
                        <ListSubheader>{`Step ${(index+1)}`}</ListSubheader>
                        {[0].map((item) => (
                            <ListItem key={`item-${item}`}>
                                <ListItemText primary={sectionId} />
                            </ListItem>
                        ))}
                    </ul>
                </li>
            ))}
        </List>
                    </Grid>

                </Grid>
            </Paper>
        </Box>
                </Box>
            </Modal>

                        }

                        <Modal open={modalCommentsRecipe} onClose={() => {setModalCommentsRecipe(false);setSelectedRecipe("");setSelectedIdRecipe("")}}>
                <Box bgcolor={"white"} className={styles.modalView}>
                <div>

                <Button
                    className={styles.cancelButton}
                    onClick={() => setModalCommentsRecipe(false)}
                >
                    <CancelIcon className={styles.buttonIcon} /> Cancel
                </Button>
                </div>
                    <CommentsList></CommentsList>

        </Box>
            </Modal>
            {(!modalPostRecipe) ? ("") : 
            <Modal open={modalPostRecipe} onClose={() => setModalPostRecipe(false)}>
                <Box bgcolor={"white"} className={styles.modal}>
                    <div>
                        <div className={styles.modalHeader}>
                            <div style={{ width: "100%" }}>
                                <img src="/small-logo.png" alt="logo" className={styles.logo} />
                                <FormControl fullWidth>
                                <UploadImage data={selectedEditRecipe} setData={setRecipeToPost} d={200}/>

                                    <Divider textAlign="left">Recipe</Divider>

                                    <TextField fullWidth label="Name" margin="normal" onChange={(e) =>
                    validateField(setRecipeToPost,setError, e.target.value, "name")
                  }/>
                                    <TextField fullWidth label="Duration" margin="normal" onChange={(e) =>
                    validateField(setRecipeToPost,setError, e.target.value, "duration")
                  }/>
                                    <TextField fullWidth label="Summary" margin="normal" onChange={(e) =>
                    validateField(setRecipeToPost,setError, e.target.value, "summary")
                  }/>
                                    &nbsp;
                            <Divider textAlign="left">Tags</Divider>
                            {
                                tagsList.map((tag, index) => (

                                    <div key={index} className="services">
                                        <TextField fullWidth label={"Tag "+(index+1)} margin="normal" onChange={(evnt)=>handleChangeTags(index, evnt)}/>
                                        {tagsList.length - 1 === index && tagsList.length < 15 && (

                                            <Fab sx={{margin:'0px 14px 0px 0px'}} size="small" color="primary" aria-label="add" onClick={handleTagsAdd}>
                                                <AddIcon />
                                            </Fab>
                                        )}
                                        {tagsList.length !== 1 && (
                                            <Fab size="small" color="primary" aria-label="add" onClick={() => handleTagsRemove(index)}>
                                                <RemoveIcon />
                                            </Fab>

                                        )}
                                    </div>
                                ))}
                            &nbsp;
                            <Divider textAlign="left">Steps</Divider>
                            {
                                stepsList.map((step, index) => (

                                    <div key={index} className="services">
                                        <TextField fullWidth label={"Step "+(index+1)} margin="normal" onChange={(evnt)=>handleChangeSteps(index, evnt)
                  }/>
                                        {stepsList.length - 1 === index && stepsList.length < 15 && (

                                            <Fab sx={{margin:'0px 14px 0px 0px'}} size="small" color="primary" aria-label="add" onClick={handleStepsAdd}>
                                                <AddIcon />
                                            </Fab>
                                        )}
                                        {stepsList.length !== 1 && (
                                            <Fab size="small" color="primary" aria-label="add" onClick={() => handleStepsRemove(index)}>
                                                <RemoveIcon />
                                            </Fab>

                                        )}
                                    </div>
                                ))}

                                </FormControl>
                            </div>
                        </div>
                        <Button
                            className={styles.confirmButton}
                            onClick={() => postThisRecipe()}
                        >
                            <AddIcon className={styles.buttonIcon} />
                            Save
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
}           
        </>
    );
}