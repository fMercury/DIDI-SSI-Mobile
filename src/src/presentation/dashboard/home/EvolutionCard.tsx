import React from "react";
import { AnimatedCircularProgress } from "react-native-circular-progress";

import { DidiText } from "../../util/DidiText";
import CredentialCard from "../common/CredentialCard";

import { CredentialDocument } from "../../../model/CredentialDocument";
import { SpecialCredentialFlag } from "../../../model/SpecialCredential";
import colors from "../../resources/colors";
import strings from "../../resources/strings";

export interface EvolutionCardProps {
	credentials: CredentialDocument[];
}

export class EvolutionCard extends React.Component<EvolutionCardProps> {
	render() {
		const str = strings.dashboard.evolution;
		const specialValue = (val: SpecialCredentialFlag["type"]): string => {
			return this.props.credentials.find(sp => sp.specialFlag?.type === val)
				? str.validationState.yes
				: str.validationState.no;
		};
		const data = [
			{ label: str.validations.cellPhone, value: specialValue("PhoneNumberData") },
			{ label: str.validations.email, value: specialValue("EmailData") },
			{ label: str.validations.document, value: specialValue("PersonalData") }
		];
		const progress = (100 / data.length) * data.filter(v => v.value === str.validationState.yes).length;
		return (
			<CredentialCard
				icon=""
				decoration={
					<AnimatedCircularProgress
						size={64}
						width={8}
						rotation={0}
						fill={progress}
						tintColor={colors.primaryText}
						backgroundColor={colors.primaryLight}
					>
						{fill => (
							<DidiText.Card.Percentage style={{ color: colors.primaryText }}>
								{Math.round(fill)}%
							</DidiText.Card.Percentage>
						)}
					</AnimatedCircularProgress>
				}
				category={str.category}
				title={str.title}
				subTitle="16.06.2019"
				color={colors.primary}
				data={[{ label: str.validationIntro, value: "" }, ...data]}
				columns={1}
			/>
		);
	}
}