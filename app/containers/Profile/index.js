/**
 *
 * Profile
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import menu from 'images/menu.svg';
import SignUp from 'components/SignUp';
import Login from 'components/Login';
import PasswordReset from 'components/PasswordReset';
import AccountSettings from 'components/AccountSettings';
import GenericErrorBoundary from 'components/GenericErrorBoundary';
import {
	selectAccountOption,
	sendLoginForm,
	sendSignUpForm,
	getUserData,
	resetPassword,
	updatePassword,
	deleteUser,
	logout,
} from './actions';
import makeSelectProfile from './selectors';
import reducer from './reducer';
import saga from './saga';
// import messages from './messages';

export class Profile extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
	componentDidMount() {
		document.addEventListener('click', this.handleClickOutside);
	}

	componentWillUnmount() {
		document.removeEventListener('click', this.handleClickOutside);
	}

	setRef = (node) => {
		this.ref = node;
	}

	getUserData = (userId) => this.props.dispatch(getUserData(userId))

	handleClickOutside = (event) => {
		const bounds = this.ref.getBoundingClientRect();
		const insideWidth = event.x >= bounds.x && event.x <= bounds.x + bounds.width;
		const insideHeight = event.y >= bounds.y && event.y <= bounds.y + bounds.height;

		if (this.ref && !(insideWidth && insideHeight) && !this.ref.contains(event.target)) {
			this.props.toggleProfile();
			document.removeEventListener('click', this.handleClickOutside);
		}
	}

	sendSignUpForm = ({ email, password, username, firstName, lastName }) => this.props.dispatch(sendSignUpForm({ email, password, username, firstName, lastName }))
	resetPassword = ({ email, password }) => this.props.dispatch(resetPassword({ email, password }))
	deleteUser = ({ email, username, userId }) => this.props.dispatch(deleteUser({ email, username, userId }))
	sendLoginForm = ({ email, password }) => this.props.dispatch(sendLoginForm({ email, password }))
	selectAccountOption = (option) => this.props.dispatch(selectAccountOption(option))
	updatePassword = ({ previousPassword, newPassword, userId }) => this.props.dispatch(updatePassword({ previousPassword, newPassword, userId }))
	logout = () => this.props.dispatch(logout())

	render() {
		const {
			activeOption,
			userAuthenticated,
			loginErrorMessage,
			signupErrorMessage,
		} = this.props.profile;
		const { toggleProfile } = this.props;

		return (
			<GenericErrorBoundary affectedArea="Profile">
				<aside ref={this.setRef} className="profile">
					<header>
						<h2>ACCOUNT</h2>
						<span role="button" tabIndex={0} className="close-icon" onClick={toggleProfile}>
							<svg className="icon"><use xmlnsXlink="http://www.w3.org/1999/xlink" xlinkHref={`${menu}#close`}></use></svg>
						</span>
					</header>
					<div className="profile-content">
						{
							userAuthenticated ? (
								<AccountSettings logout={this.logout} deleteUser={this.deleteUser} updatePassword={this.updatePassword} />
							) : (
								<React.Fragment>
									<div className="form-options">
										<span role="button" tabIndex={0} onClick={() => this.selectAccountOption('login')} className={activeOption === 'login' ? 'login active' : 'login'}>LOGIN</span>
										<span role="button" tabIndex={0} onClick={() => this.selectAccountOption('signup')} className={activeOption === 'signup' ? 'signup active' : 'signup'}>SIGN UP</span>
									</div>
									{
										activeOption === 'login' ? (
											<Login
												sendLoginForm={this.sendLoginForm}
												selectAccountOption={this.selectAccountOption}
												errorMessage={loginErrorMessage}
											/>
										) : null
									}
									{
										activeOption === 'signup' ? (
											<SignUp sendSignupForm={this.sendSignUpForm} errorMessage={signupErrorMessage} />
										) : null
									}
									{
										activeOption === 'password_reset' ? (
											<PasswordReset resetPassword={this.resetPassword} />
										) : null
									}
								</React.Fragment>
							)
						}
					</div>
				</aside>
			</GenericErrorBoundary>
		);
	}
}

Profile.propTypes = {
	dispatch: PropTypes.func.isRequired,
	toggleProfile: PropTypes.func,
	profile: PropTypes.object,
};

const mapStateToProps = createStructuredSelector({
	profile: makeSelectProfile(),
});

function mapDispatchToProps(dispatch) {
	return {
		dispatch,
	};
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

const withReducer = injectReducer({ key: 'profile', reducer });
const withSaga = injectSaga({ key: 'profile', saga });

export default compose(
	withReducer,
	withSaga,
	withConnect,
)(Profile);