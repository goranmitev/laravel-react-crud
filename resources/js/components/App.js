import React from 'react';
import ReactDOM from 'react-dom';
import Container from 'react-bootstrap/Container';

import DataGrid from './DataGrid';


class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            squares: Array(9).fill(null),
        };
    }

    render() {
        return (
            <Container>
                <DataGrid></DataGrid>
            </Container>
        );
    }

}

export default App;

if (document.getElementById('app')) {
    ReactDOM.render(<App />, document.getElementById('app'));
}
