/**
*
* SignUp
*
*/

import React from 'react';
import SvgWrapper from 'components/SvgWrapper';
import PropTypes from 'prop-types';
// import styled from 'styled-components';
// import { FormattedMessage } from 'react-intl';
// import messages from './messages';

class SignUp extends React.PureComponent {
	state = {
		username: '',
		password: '',
		confirmPassword: '',
		email: '',
		firstName: '',
		lastName: '',
		validPassword: false,
		validEmail: false,
		wasSignupSent: false,
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.socialLoginLink && nextProps.socialLoginLink !== this.props.socialLoginLink) {
			const socialWindow = window.open(nextProps.socialLoginLink, '_blank');

			socialWindow.focus();
		}
	}

	componentDidUpdate(prevProps, prevState) {
		if ((prevState.confirmPassword !== prevState.password) && (this.state.password === this.state.confirmPassword)) {
			this.setValidPassword(true);
		} else if (((prevState.confirmPassword === prevState.password) && prevState.password.length) && (this.state.password !== this.state.confirmPassword)) {
			this.setValidPassword(false);
		}
	}

	setValidPassword = (valid) => {
		this.setState({ validPassword: valid });
	}

	handlePasswordChange = (e) => {
		this.setState({ password: e.target.value });
	}

	handleFirstName = (e) => {
		this.setState({ firstName: e.target.value });
	}

	handleLastName = (e) => {
		this.setState({ lastName: e.target.value });
	}

	handleEmailChange = (e) => {
		const email = e.target.value;
		const indexOfAt = email.indexOf('@');

		if (indexOfAt !== -1) {
			this.setState({
				username: email.slice(0, indexOfAt),
				validEmail: true,
				email,
			});
		} else {
			this.setState({ email });
		}
	}

	handleConfirmPassword = (e) => {
		const value = e.target.value;

		this.setState({ confirmPassword: value });
	}

	handleSignup = (e) => {
		e.preventDefault();
		if (this.state.validPassword && this.state.validEmail) {
			this.props.sendSignupForm({
				email: this.state.email,
				password: this.state.password,
				username: this.state.username,
				firstName: this.state.firstName,
				lastName: this.state.lastName,
			});
			this.setState({ wasSignupSent: true });
		}
	}

	handleSocialLogin = ({ driver }) => {
		const { activeDriver, socialLoginLink } = this.props;

		if (driver === activeDriver && socialLoginLink) {
			const socialWindow = window.open(socialLoginLink, '_blank');

			socialWindow.focus();
		} else {
			this.props.socialMediaLogin({ driver });
		}
	}

	get signupForm() {
		return (
			<form onSubmit={this.handleSignup}>
				<input onChange={this.handleEmailChange} className="email" placeholder="Enter E-mail" value={this.state.email} />
				<input onChange={this.handleFirstName} className="name-inputs" placeholder="Enter First Name" value={this.state.firstName} />
				<input onChange={this.handleLastName} className="name-inputs" placeholder="Enter Last Name" value={this.state.lastName} />
				<input autoComplete="new-password" type="password" onChange={this.handlePasswordChange} className="first-password" placeholder="Enter Password" value={this.state.password} />
				<input autoComplete="new-password" type="password" onChange={this.handleConfirmPassword} className="second-password" placeholder="Confirm Password" value={this.state.confirmPassword} />
				<div className="sign-up-button">
					<button type="submit" className="text">SIGN UP</button>
				</div>
			</form>
		);
	}

	render() {
		const { errorMessage } = this.props;

		return (
			<React.Fragment>
				<section className="message">
					<p>Signing up lets you create Bookmarks, Highlights and Notes, and access them wherever you use Bible.is!</p>
				</section>
				{
					errorMessage ? (
						<div className="signup-error-message">{errorMessage}</div>
					) : null
				}
				{this.signupForm}
				<div role={'button'} tabIndex={0} onClick={() => this.handleSocialLogin({ driver: 'google' })} className="google">
					<SvgWrapper className="svg" height="30px" width="30px" fill="#fff" svgid="google_plus" />
					Sign up with Google
				</div>
				<div role={'button'} tabIndex={0} onClick={() => this.handleSocialLogin({ driver: 'facebook' })} className="facebook">
					<SvgWrapper className="svg" height="30px" width="30px" fill="#fff" svgid="facebook" />
					Sign up with Facebook
				</div>
				<section className="disclaimer">
					By creating an account, you agree to the Bible.is
					<a className="link" target={'_blank'} href="http://www.bible.is/privacy"> Privacy Policy </a> &
					<a className="link" target={'_blank'} href="http://www.bible.is/terms"> Terms of Use</a>.
				</section>
			</React.Fragment>
		);
	}
}

SignUp.propTypes = {
	sendSignupForm: PropTypes.func,
	socialMediaLogin: PropTypes.func,
	socialLoginLink: PropTypes.string,
	errorMessage: PropTypes.string,
	activeDriver: PropTypes.string,
};

export default SignUp;
