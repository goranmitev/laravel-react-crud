import React from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import Alert from 'react-bootstrap/Alert';
import Spinner from 'react-bootstrap/Spinner';
import InputGroup from 'react-bootstrap/InputGroup';
import { Redirect } from 'react-router-dom';

class CreateBookForm extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            id: props.match.params.id,
            isFetching: false,
            success: false,
            failed: false,
            form: {
                title: '',
                category_id: 1,
                description: '',
                currency: '$',
                price: '',
                upc: '',
            },
            errors: [],
            categories: []
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
        this.fetchCategories();
    }

    fetchCategories() {

        this.setState({
            isFetching: true
        });

        axios.get('/api/categories')
            .then((response) => {
                this.setState({
                    categories: response.data.categories,
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

        axios.post('/api/books', this.state.form)
            .then((response) => {
                const editUrl = "/books/"+response.data.id+"/edit";

                if (response.data.success) {
                    window.location.replace(editUrl);
                }

            })
            .catch((errors) => {
                // console.log(errors);
                this.setState({
                    isFetching: false,
                    success: false,
                    failed: true,
                    submitting: false,
                    errors: errors.response.data.errors
                });
            });
    }

    renderCategoriesDropdown() {

        const categories = this.state.categories;

        return categories.map((category, index) => {
            const { id, name } = category; //destructuring
            return (
                <option key={id} value={id}>{name}</option>
            )
        });
    }

    renderErrors() {

        const errors = this.state.errors;

        if (Object.keys(errors).length > 0) {

            return Object.keys(errors).map(item => {
                return (
                    <li key={item}>{errors[item][0]}</li>
                )
            });
        }
    }

    render() {

        const {
            title,
            category_id,
            price,
            currency,
            upc,
            description } = this.state.form;

        if (!this.state.isFetching) {
            return (
                <Form onSubmit={this.handleSubmit}>
                    <div>
                        <Link to='/'>View All books</Link>
                        <br />
                        <br />
                        <h1>Create New Book</h1>
                    </div>

                    <Alert show={this.state.success} variant='success'>
                        Book Saved!
                    </Alert>

                    <Alert show={this.state.failed} variant='danger'>
                        Error saving book:
                        <ul>
                            {this.renderErrors()}
                        </ul>
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

                    <Form.Group controlId="category_id">
                        <Form.Label>Category</Form.Label>
                        <Form.Control as="select"
                            name="category_id"
                            value={category_id}
                            onChange={this.changeHandler}>
                            {this.renderCategoriesDropdown()}
                        </Form.Control>
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

                    <InputGroup className="mb-3">
                        <InputGroup.Prepend>
                        <InputGroup.Text id="basic-addon1">{currency}</InputGroup.Text>
                        </InputGroup.Prepend>
                        <Form.Control
                        name="price"
                        type="text"
                        placeholder="Enter book price"
                        defaultValue={price}
                        onChange={this.changeHandler} />
                    </InputGroup>

                    <Form.Group controlId="upc">
                        <Form.Label>UPC</Form.Label>
                        <Form.Control
                            name="upc"
                            type="text"
                            placeholder="Enter UPC"
                            defaultValue={upc}
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

export default CreateBookForm;
