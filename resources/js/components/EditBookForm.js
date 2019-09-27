import React from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import Alert from 'react-bootstrap/Alert';
import Spinner from 'react-bootstrap/Spinner';

class EditBookForm extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            id: props.match.params.id,
            isFetching: false,
            success: false,
            failed: false,
            form: {
                title: '',
                description: ''
            }
        };

        this.changeHandler = this.changeHandler.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);

    }

    changeHandler(event) {

        const name = event.target.name;
        const value = event.target.value;

        var form = { ...this.state.form }
        form[name] = value;
        this.setState({ form });

        this.setState({
            success: false,
            failed: false
        });
    }

    componentDidMount() {
        this.fetchData(this.state.id);
    }

    fetchData(id) {

        this.setState({
            isFetching: true
        });

        axios.get('/api/books/' + id)
            .then((response) => {
                this.setState({
                    form: response.data,
                    isFetching: false
                });
            })
            .catch((error) => {
                console.log(error);
                this.setState({
                    isFetching: false
                });
            });
    }

    handleSubmit(event) {
        event.preventDefault();
        event.stopPropagation();

        this.setState({
            submitting: true,
            success: false,
            failed: false,
        });

        axios.put('/api/books/' + this.state.id, this.state.form)
            .then((response) => {
                this.setState({
                    form: response.data.book,
                    isFetching: false,
                    success: response.data.success,
                    failed: false,
                    submitting: false
                });
            })
            .catch((error) => {
                console.log(error);
                this.setState({
                    isFetching: false,
                    success: false,
                    failed: true,
                    submitting: false
                });
            });
    }


    render() {

        const { title, description } = this.state.form;

        if (!this.state.isFetching) {
            return (
                <Form onSubmit={this.handleSubmit}>
                    <div>
                        <Link to='/'>View All books</Link>
                        <br />
                        <br />
                    </div>

                    <Alert show={this.state.success} variant='success'>
                        Book Saved!
                </Alert>

                    <Alert show={this.state.failed} variant='danger'>
                        Error saving book!
                </Alert>

                    <Form.Group controlId="title">
                        <Form.Label>Title</Form.Label>
                        <Form.Control
                            name="title"
                            type="text"
                            placeholder="Enter book title"
                            defaultValue={title}
                            onChange={this.changeHandler} />
                    </Form.Group>

                    <Form.Group controlId="description">
                        <Form.Label>Description</Form.Label>
                        <Form.Control as="textarea"
                            name="description"
                            type="text"
                            placeholder="Description"
                            value={description}
                            onChange={this.changeHandler} />
                    </Form.Group>

                    <Button disabled={this.state.submitting} variant="primary" type="submit">
                        Submit
                    </Button>

                </Form>


            );
        } else {
            return (
                <Spinner animation="border" role="status">
                    <span className="sr-only">Loading...</span>
                </Spinner>
            );
        }

    }

}

export default EditBookForm;
