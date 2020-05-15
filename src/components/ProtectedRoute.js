
import React, { Component } from 'react';
import { Route, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';

export default class ProtectedRoute extends Component {
    render() {
        const { component: Component, ...props } = this.props;
        return (
            <Route 
                {...props} 
                render={() => (
                    props.loggedIn
                        ? <Component {...props} />
                        : <Redirect to='/' />
                )} 
            />
        );
    }
}

ProtectedRoute.propTypes = {
    component: PropTypes.elementType.isRequired,
};

