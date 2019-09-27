import React from 'react';
import Table from 'react-bootstrap/Table';
import Pagination from 'react-bootstrap/Pagination';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import Spinner from 'react-bootstrap/Spinner';

class DataGrid extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            url: '/api/books',
            data: [],
            pageData: [],
            isFetching: false
        };
    }

    componentDidMount() {

        this.setState({
            isFetching: true
        });

        this.fetchData(this.state.url);
    }

    fetchData(url) {

        if (url === null) {
            return false;
        }

        axios.get(url)
            .then((response) => {
                this.setState({
                    data: response.data.data,
                    pageData: response.data,
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


    renderTableData() {

        const { data, pageData, isFetching } = this.state;

        if (isFetching) {
            return [];
        }
        return data.map((book, index) => {
            const { id, title, image } = book; //destructuring
            const editUrl = "/books/"+id+"/edit";
            return (
                <tr key={id}>
                    <td>{id}</td>
                    <td><img height="50" src={image}/></td>
                    <td>{title}</td>
                    <td>
                        <Link to={editUrl}>Edit</Link>
                        {/* <a href={editUrl}>Edit</a> */}
                    </td>
                </tr>
            )
        });
    }

    handleNextPageClick(e) {
        e.preventDefault();
        this.fetchData(this.state.pageData.next_page_url);
    }

    handlePrevPageClick(e) {
        e.preventDefault();
        this.fetchData(this.state.pageData.prev_page_url);
    }

    renderPagination() {

        let active = this.state.pageData.current_page;
        let total = this.state.pageData.last_page;

        return (
            <Pagination>
                <Pagination.Prev onClick={(e) => this.handlePrevPageClick(e)} />
                <Pagination.Item>Page {active} of {total}</Pagination.Item>
                <Pagination.Next onClick={(e) => this.handleNextPageClick(e)} />
            </Pagination>

        );
    }

    renderShowing() {
        return (
            <p>Showing Books: {this.state.pageData.from} - {this.state.pageData.to} out of {this.state.pageData.total}</p>
        );
    }

    render() {

        if (this.state.isFetching) {
            return (
                <Spinner animation="border" role="status">
                    <span className="sr-only">Loading...</span>
                </Spinner>
            );
        } else {

            const createUrl = "/books/create";
        return (
            <div>
                <Link to={createUrl}>Create New Book</Link>
                <br/>
                <br/>

                {this.renderShowing()}

                <Table>
                    <thead>
                        <tr>
                            <th>
                                ID
                            </th>
                            <th>
                                Image
                            </th>
                            <th>
                                Title
                            </th>
                            <th>
                                Actions
                            </th>

                        </tr>
                    </thead>
                    <tbody>
                        {this.renderTableData()}
                    </tbody>
                </Table>

                {this.renderPagination()}

                <p>{this.state.isFetching ? 'Fetching books...' : ''}</p>
            </div>

        );
        }
    }

}

export default DataGrid;
