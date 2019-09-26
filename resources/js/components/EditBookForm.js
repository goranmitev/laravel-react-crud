import React from 'react';

class EditBookForm extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            id: props.match.params.id
        };

    }

    componentDidMount() {

    }


    render() {

        return (
            <div>
                Edit Book ID: {this.state.id}
            </div>

        );

    }

}

export default EditBookForm;
