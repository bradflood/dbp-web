/**
*
* FadeTransition
*
*/

import React from 'react';
import PropTypes from 'prop-types';
import { CSSTransition } from 'react-transition-group';
// import styled from 'styled-components';

const FadeTransition = ({ children, classNames, ...props }) => (
	<CSSTransition
		{...props}
		timeout={1000}
		classNames={classNames || 'fade'}
	>
		{children}
	</CSSTransition>
);

FadeTransition.propTypes = {
	children: PropTypes.node,
	classNames: PropTypes.string,
};

export default FadeTransition;
