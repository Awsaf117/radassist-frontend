import React from 'react';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Typography from '@material-ui/core/Typography';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';


const History = props => {
	return (
		<ExpansionPanel disabled={props.enabled}>
			<ExpansionPanelSummary
				expandIcon={<ExpandMoreIcon/>}
				aria-controls="panel1a-content"
				id="panel1a-header"
			>
				<Typography>{props.title}</Typography>
			</ExpansionPanelSummary>
			<ExpansionPanelDetails>
				<Typography>
					{props.details}
				</Typography>
			</ExpansionPanelDetails>
		</ExpansionPanel>
	);
};

export default History;
