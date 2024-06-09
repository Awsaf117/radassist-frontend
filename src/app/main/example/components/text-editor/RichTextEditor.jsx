import React, { Component } from 'react';
import { Editor } from 'react-draft-wysiwyg';
import { EditorState } from 'draft-js';
import XRayApi from '../../api/backend';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import './textEditor.css';
import { convertFromRaw } from 'draft-js';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import { flattenErrorMessages, formatDate } from '../../api/utilities';
import { notification } from 'antd';
const content = {
	entityMap: {},
	blocks: []
};
const { Option } = Select;
export default class RichTextEditor extends Component {

    constructor(props) {
        super(props);
      }
      state = {
		editorState: undefined,
		contentState: undefined,
		errorMessages: [],
		showModal: false,
		templateName: null,
		templates: {}
    };
    templateSubmitApiCallback = templateApiResponse => {
		if (templateApiResponse.response.status === 201) {
			// this.props.history.push('/upload');
		} else {
			const errorMessages = flattenErrorMessages(templateApiResponse);
			this.setState({ errorMessages });
		}
	};

    openNotificationWithIcon = (type, message, description) => {
		notification[type]({
			message: message,
			description: description
		});
    };
    
	handleTemplateSave = e => {
		// console.log("TEMPLATE IS CLICKED", this.state.showModal)
		const data = {
			template_content: this.state.contentState,

			template_name: this.state.templateName
		};
		XRayApi.createTemplate(data, this.templateSubmitApiCallback);
	};

	getTemplatesApiResponse = apiResponse => {
		const statusCode = apiResponse.response.status;
		if (statusCode === 200) {
			console.log(apiResponse.response.data.result)
			this.setState({ templates: apiResponse.response.data.result});
		} else {
            this.setState({ error: true, errorMessage: '' });
			this.openNotificationWithIcon('error', 'No Templates found', 'No template found under this user or hospital');
		}
    };
    
    GetTemplates = e => {
		XRayApi.getTemplates(this.getTemplatesApiResponse);
	};

    GetContent = e => {
		e.persist();
		const content_value = JSON.parse(e.target.value);
		console.log(content_value)
		
		const contentState = convertFromRaw(content_value.blocks ? content_value : content);
		const editorState = EditorState.createWithContent(contentState,null);
		
		this.setState({
			contentState: contentState,
			editorState: editorState
		});
		
	};

	onTemplateNameChange = e => {
		e.persist();
		const templateName = e.target.value;
		this.setState({
			templateName
		});
	};

    onEditorStateChange = editorState => {
		// console.log(editorState)
		this.setState({
			editorState
		});
	};

	onContentStateChange = contentState => {
		console.log(contentState)
		this.setState({
			contentState
		});
		// console.log('FROM CONTENTSTATECHANGE', contentState);
	};

    render() {
        const {
			uploadStatus,
			uploadUrls: uploadUrls,
			value,
			data: options,
			errorMessages,
			editorState,
			open
		} = this.state;
		// editorState = this.state.editorState
		const templates = this.state.templates;

        return (
            <div>
                {/* <div style={{ marginTop: '1em', marginBottom: '2em' }}>
                    <FormControl variant="standard" style={{ width: '25em', marginRight: '15em' }}>
                        <InputLabel htmlFor="outlined-age-native-simple">
                            Select from Your Hospital Templates
                        </InputLabel>
                        <Select
                            native
                            label="Select-Template"
                            onClick={this.GetTemplates}
                            onChange={this.GetContent}
                            inputProps={{
                                
                                id: 'outlined-age-native-simple',
                                }}
                        >
                            {templates.length &&
                                templates.map(x => (
                                    <option
                                        key={x.template_id}
                                        value={JSON.stringify(x.template_content)}
                                        style={{ border: 'solid' }}
                                        // onClick={this.handleGetContent}
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
                </div> */}
                <Editor
                    editorClassName={"report-editor"}
                    editorState={this.state.editorState}
                    onEditorStateChange={this.onEditorStateChange}
                    onContentStateChange={this.onContentStateChange}
                />
            </div>
        )
    }
}