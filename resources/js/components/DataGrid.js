import React from 'react';
// import Row from 'react-bootstrap/Row';
// import Col from 'react-bootstrap/Col';
// import Table from 'react-bootstrap/Table';
import SmartDataTable from 'react-smart-data-table'

class DataGrid extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            data: [],
            isFetching: false
        };
    }

    componentDidMount() {

        this.setState({
            isFetching: true
        });

        axios.get('/api/books')
            .then((response) => {
                console.log(response);

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

        const sematicUI = {
            segment: 'ui basic segment',
            message: 'ui message',
            input: 'ui icon input',
            searchIcon: 'search icon',
            rowsIcon: 'numbered list icon',
            table: 'ui compact selectable table',
            select: 'ui dropdown',
            refresh: 'ui labeled primary icon button',
            refreshIcon: 'sync alternate icon',
            change: 'ui labeled secondary icon button',
            changeIcon: 'exchange icon',
            checkbox: 'ui toggle checkbox',
            loader: 'ui active text loader',
            deleteIcon: 'trash red icon',
        }

        const headers = {
            id: {
                text: 'ID',
                invisible: false,
            },
            title: {
                text: 'Title',
                invisible: false,
            },
            'category.name': {
                text: 'Category',
                invisible: false,
            },
            'category.id': {
                invisible: true
            },
            category_id: {
                invisible: true
            },
            created_at: {
                invisible: true
            },
            updated_at: {
                invisible: true
            },
            description: {
                invisible: true
            },

            price: {
                text: 'Price',
                invisible: false
            },
            currency: {
                invisible: true
            },
            image: {
                invisible: true
            },



            actionsd: {
                text: 'Actions',
                sortable: false,
                filterable: false,
                transform: (value, idx, row) => (
                    <i
                        className={sematicUI.deleteIcon}
                        style={{ cursor: 'pointer' }}
                        // onClick={(e) => this.handleDelete(e, idx, row)}
                        // onKeyDown={(e) => this.handleDelete(e, idx, row)}
                        role='button'
                        tabIndex='0'
                        aria-label='delete row'
                    />
                ),
            },

            // If a dummy column is inserted into the data, it can be used to customize
            // the table by allowing actions per row to be implemented, for example
            // tableActions: {
            //     text: 'Actions',
            //     invisible: false,
            //     sortable: false,
            //     filterable: false,
            //     transform: (value, index, row) => {
            //         // The following results should be identical
            //         console.log(value, row.tableActions)
            //         // Example of table actions: Delete row from data by row index
            //         return (
            //             <button onClick={() => deleteRow(row)}>
            //                 Delete Row
            //       </button>
            //         )
            //     },
            // },
        }


        return (
            <div>
                <SmartDataTable
                    data={this.state.data.data}
                    headers={headers}
                    // orderedHeaders={[
                    //     'id',
                    //     'title',
                    //     'category.name',
                    //     'price',
                    //     'rating',
                    //     'upc',
                    //     'actions',
                    //   ]}
                    name='books-table'
                    withLinks
                    hideUnordered
                    className='ui compact selectable table'

                />,
                <p>{this.state.isFetching ? 'Fetching books...' : ''}</p>
            </div>

        );


        //             <table class="table-admin">
        //                 <thead>
        //                     <tr>
        //                         <th v-for="(th, index) in table.columns" : key="index">
        //             <a href="#" v-if="th.sortable" @click.prevent="onSort(index)">
        //                 {{ th.label }}
        //                         <i class="fa fa-sort-down" v-if="sorting.direction=='asc' && sorting.sort==index"></i>
        //                         <i class="fa fa-sort-up" v-else-if="sorting.direction=='desc' && sorting.sort==index"></i>
        //                         <i class="fa fa-sort" v-else></i>
        //             </a>
        //                     <span v-else>{{ th.label }}</span>
        //         </th>
        //     </tr>
        // </thead >
        //             <tbody>
        //                 <tr v-if="filtering">
        //                     <td v-for="(column, index) in table.columns" : key="index">
        //             <input type="text" class="form-control" v-if="column.filterable && column.filter=='text'" @keyup="onFilter(column, index, $event.target.value)">
        //             <select class="form-control" v-if="column.filterable && column.filter=='select'" @change="onFilter(column, index, $event.target.value)">
        //                 <option value="">Please select</option>
        //                     <option v-for="(option, value) in column.filterOptions" : value="value" :key="value">{{ option }}</option>
        //             </select>
        //         </td >
        //     </tr >
        //             <tr v-for="(row, rowIndex) in table.records.data" : key="rowIndex">
        //                 <td v-for="(column, columnIndex) in table.columns" : key="columnIndex">
        //             <component v-if="column.type" v-bind: is="column.type" v-bind:options="getOptions(row, column, columnIndex)"></component>
        //             <template v-else>{{ getItem(row, columnIndex) }}</template>
        //         </td >
        //     </tr >
        // </tbody >
        // </table >
        // );
    }

}

export default DataGrid;
