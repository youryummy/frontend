import * as React from 'react';
import { styled } from '@mui/material/styles';
import PinnedSubheaderList from "../StepsList/PinnedSubheaderList";

const Img = styled('img')({
    margin: 'auto',
    display: 'block',
    maxWidth: '100%',
    maxHeight: '100%',
});

export default function StepsCard({data}) {
    return(
        <PinnedSubheaderList data={data}/>
    )
}