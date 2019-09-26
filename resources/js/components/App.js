import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import Container from 'react-bootstrap/Container';

import DataGrid from './DataGrid';
import EditBookForm from './EditBookForm';


class App extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Router>
                <Container>
                        <Route exact path='/' component={DataGrid} />
                        <Route path='/books/:id/edit' component={EditBookForm} />
                 </Container>
            </Router>
        );
    }

}

export default App;

if (document.getElementById('app')) {
    ReactDOM.render(<App />, document.getElementById('app'));
}
