import React, { Component } from 'react';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
export default class TemplateComponent extends Component {
	render() {
		return (
			<div style={{ marginTop: '1em', marginLeft: '15em', marginBottom: '2em' }}>
				<FormControl variant="standard" style={{ width: '20em' }}>
					<InputLabel htmlFor="outlined-age-native-simple">Select from Your Hospital Templates</InputLabel>
					<Select native label="Select-Template" onClick={this.GetTemplates} onChange={this.GetContent}>
						{templates.length &&
							templates.map(x => (
								<option
									key={x.template_id}
									value={JSON.stringify(x.template_content)}
									style={{ border: 'solid' }}

									/* x.template_content.data */
								>
									{x.template_name}
								</option>
							))}
					</Select>
				</FormControl>
				<TextField
					onChange={this.onTemplateNameChange}
					id="filled-basic"
					label="Enter template name here"
					variant="filled"
					required
					style={{ marginLeft: '15px' }}
				/>

				<Button
					style={{ marginLeft: '25px', marginTop: '10px' }}
					color="primary"
					variant="contained"
					onClick={this.handleTemplateSave}
				>
					Save as template
				</Button>
			</div>
		);
	}
}
