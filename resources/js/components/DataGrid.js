import React from 'react';
import Table from 'react-bootstrap/Table';
import Pagination from 'react-bootstrap/Pagination';

class DataGrid extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            data: [],
            pageData: [],
            isFetching: false
        };
    }

    componentDidMount() {

        this.setState({
            isFetching: true
        });

        axios.get('/api/books')
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
            console.log('in Rendertable data');
            console.log(data);

            return [];
        }
        return data.map((book, index) => {
            const { id, title, image } = book; //destructuring
            return (
                <tr key={id}>
                    <td>{id}</td>
                    <td><img height="50" src={image}/></td>
                    <td>{title}</td>
                    <td>
                        <a href="edit">Edit</a>

                        <a href="delete">Delete</a>
                    </td>
                </tr>
            )
        });
    }

    renderPagination() {

        let active = this.state.pageData.current_page;
        let total = this.state.pageData.last_page;

        return (
            <Pagination>
                <Pagination.Prev />
                <Pagination.Item>Page {active} of {total}</Pagination.Item>
                <Pagination.Next />
            </Pagination>
        );
    }

    render() {

        return (
            <div>
                <p>Showing Books: {this.state.pageData.from} - {this.state.pageData.to} out of {this.state.pageData.total}</p>
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

export default DataGrid;
