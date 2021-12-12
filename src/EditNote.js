import React from "react";
import {toast} from "react-toastify";
import { FormErrors } from "./FormErrors";

export default class EditNote extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            title: "",
            body: "",
            date: "",
            pinned: false, 
            formErrors: {title: '', body: '', date: '' },
            titleValid: false,
            bodyValid: false,
            dateValid: false,
            formValid: false
        };

        this.handleTitleChange = this.handleTitleChange.bind(this);
        this.handleBodyChange = this.handleBodyChange.bind(this);
        this.handleDateChange = this.handleDateChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleTitleChange(event) {
        this.setState({ title: event.target.value},
            () => {this.validateField("title", event.target.value)});
    }

    handleBodyChange(event) {
        this.setState({body: event.target.value},
            () => {this.validateField("body", event.target.value)});
    }

    handleDateChange(event) {
        this.setState({date: event.target.value},
            () => {this.validateField("date", event.target.value)});
    }

    validateField( fieldName, value) {
        let fieldValidationErrors = this.state.formErrors;
        let titleValid = this.state.titleValid;
        let bodyValid = this.state.bodyValid;
        let dateValid = this.state.dateValid;

        switch( fieldName) {
            case 'title':
                titleValid = value.length > 0;
                fieldValidationErrors.title = titleValid ? '' : " is invalid";
                break;
            case 'body':
                bodyValid = value.length > 0;
                fieldValidationErrors.body = bodyValid ? '' : " is invalid";
                break;
            case 'date':
                dateValid = value.length > 0;
                fieldValidationErrors.date = dateValid ? '' : " is invalid";
                break;
        }
        this.setState({
            formErrors: fieldValidationErrors,
            titleValid: titleValid,
            bodyValid: bodyValid,
            dateValid: dateValid
        }, this.validateForm);
    }

    validateForm() {
        this.setState({
            formValid: this.state.titleValid && this.state.bodyValid
        });
    }

    handleSubmit(event) {
        event.preventDefault();

        const id = this.props.match.params.notesid;
        fetch(`https://final-proj-app.herokuapp.com/api/notes/${id}`, {
            method: "PUT",
            body: JSON.stringify({
                title: this.state.title,
                body: this.state.body,
                date: this.state.date,
                pinned: this.state.pinned
            }),
            headers: {
                "Content-type":"application/json; charset=UTF-8"
            }
        }).then((response) => {
            return response.json();
        }).then((json) => {
            toast.success(`Post was successfuly updated!`);
            console.log(json);
            this.props.history.push("/");
        })
    }

    componentDidMount() {
        //console.log(notesId);
        const id = this.props.match.params.notesid;
        document.title = `Editing Note ${id}`;
        console.log(id);
        fetch(`https://final-proj-app.herokuapp.com/api/notes/${id}`)
            .then((response) => {
                return response.json();
            }).then((json) => {
                console.log(json);
                this.setState(json);
            })
    }


    render() {
        return(
            <form onSubmit={this.handleSubmit}>
                <div className="my-3">
                    <label htmlFor="title" className="form-label">
                        Title
                    </label>
                    <input 
                        type="title"
                        id="title"
                        className="form-control"
                        value={this.state.title}
                        onChange={(event) => {
                            this.handleTitleChange(event);
                        }}
                    />
                </div>
                <div className="my-3">
                    <label htmlFor="body" className="form-label">
                        Body
                    </label>
                    <textarea
                        id="body"
                        className="form-control"
                        value={this.state.body}
                        onChange={(event) => {
                            this.handleBodyChange(event);
                        }}
                    >
                    </textarea>
                </div>

                <div className="my-3">
                    <label htmlFor="title" className="form-label">
                        Date:
                    </label>
                    <input
                        type="date"
                        id="date"
                        className="form-control"
                        value={this.state.date}
                        onChange={(event) => {
                            this.handleDateChange(event);
                        }}
                    />
                </div>

                 <div className="error-message">
                    <div className="panel panel-default">
                        <FormErrors formErrors={this.state.formErrors} />
                    </div>
                </div>

                <button type="submit" className="btn btn-primary">
                    Edit Note
                </button>
            </form>

        )
    }
}