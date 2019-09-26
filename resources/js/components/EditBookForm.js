import React from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';

class EditBookForm extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            id: props.match.params.id,
            isFetching: false,
            data: []
        };

        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);

    }

    handleInputChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        this.setState({
            name: value
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
                    data: response.data,
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

        axios.put('/api/books/' + this.state.id, this.state.data)
            .then((response) => {
                this.setState({
                    data: response.data,
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


    render() {

        const { title, description } = this.state.data;

        return (
            <Form onSubmit={(e) => this.handleSubmit(e)}>
                <div>
                    <Link to='/'>View All books</Link>
                    <br />
                    <br />
                </div>
                <Form.Group controlId="title">
                    <Form.Label>Title</Form.Label>
                    <Form.Control type="text" placeholder="Enter book title" value={title} onChange={(e) => this.handleInputChange(e)} />
                </Form.Group>

                <input
            name="isGoing"
            type="checkbox"
            checked={this.state.isGoing}
            onChange={this.handleInputChange} />

                <Form.Group controlId="description">
                    <Form.Label>Description</Form.Label>
                    <Form.Control type="text" placeholder="Description" value={description} onChange={(e) => this.handleInputChange(e)} />
                </Form.Group>

                <Button variant="primary" type="submit">
                    Submit
                </Button>

            </Form>


        );

    }

}

export default EditBookForm;
