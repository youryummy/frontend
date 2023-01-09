import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import Divider from '@mui/material/Divider';

export default function PinnedSubheaderList({data}) {
    return (

        <List
            sx={{
                width: '100%',
                maxWidth: 500,
                bgcolor: 'background.paper',
                position: 'relative',
                overflow: 'auto',
                maxHeight: 300,
                '& ul': { padding: 0 },
            }}
            subheader={<li />}
        >
            <Divider textAlign="left" sx={{width:'418px'}}>Steps</Divider>

            {data["steps"].map((sectionId,index) => (
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
    );
}