import React from 'react';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import TextField from '@material-ui/core/TextField';

const Symptoms = ({ name, handleCheck, checkboxName, showDraft, description, handleInputField }) => {
	return (
		<div style={{ marginBottom: '8px' }}>
			<div style={{ textAlign: 'left' }}>
				<FormControlLabel
					control={
						<Checkbox
							name={name}
							onChange={handleCheck}
						/>
					}
					label={checkboxName}
				/>
			</div>
			{showDraft && (
				<TextField
					label={'Describe your situation'}
					variant="outlined"
					name={name}
					onChange={handleInputField(name)}
					fullWidth
				/>
			)}
		</div>
	);
};

export default Symptoms;
