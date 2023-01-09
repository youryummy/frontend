import * as React from 'react';
import { styled } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import Stack from '@mui/material/Stack';
import CardMedia from '@mui/material/CardMedia';
import Box from '@mui/material/Box';
import CustomizedAccordions from "../AccordionCustomized/CustomizdAccordions";
import StepsCard from "../StepsCard/StepsCard";

const Img = styled('img')({
    margin: 'auto',
    display: 'block',
    maxWidth: '100%',
    maxHeight: '100%',
});

export default function RecipesCard({data}) {
    return(
        <Box
        >
        <Paper
            sx={{
                p: 2,
                margin: '63px 0px 0px 69px',
                maxWidth: 1000,
                flexGrow: 1,
                backgroundColor: (theme) =>
                    theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
            }}
        >
            <Grid container spacing={2} >
                <Grid item sx={{margin:'14px 0px 0px 0px'}} >
                        <CardMedia
                            component="img"
                            alt="green iguana"
                            height="200"
                            image="http://t1.gstatic.com/licensed-image?q=tbn:ANd9GcSnCn9k-c100ccJnb6N8Odb8Ge-6iisByej4f6xu-rSmo4tKAxxcWz_AOgH8f1THy55"
                        />
                </Grid>
                <Grid item xs={12} sm container>
                    <Grid item xs container direction="column" spacing={2}>
                        <Grid item xs>
                            <Typography gutterBottom variant="subtitle1" component="div">
                                {data["name"]}
                            </Typography>
                            <Typography variant="body2" gutterBottom>
                                by Jack • <AccessTimeIcon fontSize="inherit" /> {data["duration"]} min
                            </Typography>
                            <Stack direction="row" spacing={1}>
                                <CustomizedAccordions data={data}> </CustomizedAccordions>
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
                        <StepsCard data={data}/>
                    </Grid>

                </Grid>
            </Paper>
        </Box>
    )
}