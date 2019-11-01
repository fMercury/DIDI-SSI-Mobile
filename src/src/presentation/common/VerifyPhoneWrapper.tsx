import React from "react";

import { ServiceWrapper } from "../../services/common/ServiceWrapper";

import { VerifySmsCodeState } from "../../services/user/verifySmsCode";
import { didiConnect } from "../../store/store";

import { VerifyPhoneProps, VerifyPhoneScreen } from "./VerifyPhone";

interface VerifyPhoneWrapperProps {
	onServiceSuccess(): void;
	contentImageSource: VerifyPhoneProps["contentImageSource"];
}
interface VerifyPhoneWrapperStateProps {
	verifyPhoneCodeState: VerifySmsCodeState;
}
interface VerifyPhoneWrapperDispatchProps {
	verifyPhoneCode(code: string): void;
}
type VerifyPhoneWrapperInternalProps = VerifyPhoneWrapperProps &
	VerifyPhoneWrapperStateProps &
	VerifyPhoneWrapperDispatchProps;

class VerifyPhoneWrapper extends React.Component<VerifyPhoneWrapperInternalProps> {
	render() {
		return (
			<ServiceWrapper
				serviceState={this.props.verifyPhoneCodeState}
				onServiceSuccess={() => this.props.onServiceSuccess()}
			>
				<VerifyPhoneScreen
					contentImageSource={this.props.contentImageSource}
					onPressContinueButton={inputCode => this.onPressContinueButton(inputCode)}
					isContinuePending={this.props.verifyPhoneCodeState.state === "PENDING"}
				/>
			</ServiceWrapper>
		);
	}

	private onPressContinueButton(inputCode: string) {
		this.props.verifyPhoneCode(inputCode);
	}
}

const connected = didiConnect(
	VerifyPhoneWrapper,
	(state): VerifyPhoneWrapperStateProps => ({
		verifyPhoneCodeState: state.serviceCalls.verifySmsCode
	}),
	(dispatch): VerifyPhoneWrapperDispatchProps => ({
		verifyPhoneCode: (validationCode: string) =>
			dispatch({
				type: "SERVICE_VERIFY_SMS_CODE",
				serviceAction: {
					type: "START",
					args: { did: "did:ethr:0x460fec23bd53610bf6d0ed6c6a1bef5ec86e740d", validationCode }
				}
			})
	})
);

export { connected as VerifyPhoneWrapper };
