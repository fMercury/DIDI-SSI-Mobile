import { CredentialDocument, EthrDID } from "didi-sdk";
import React from "react";
import { StyleSheet } from "react-native";
import { State } from "react-native-gesture-handler";

import { assertUnreachable } from "../../../util/assertUnreachable";
import { DidiText } from "../../util/DidiText";

import { ActiveDid } from "../../../store/reducers/didReducer";
import { IssuerRegistry } from "../../../store/reducers/issuerReducer";
import { SpecialCredentialMap } from "../../../store/selector/credentialSelector";
import { StoreContent } from "../../../store/store";
import colors from "../../resources/colors";
import strings from "../../resources/strings";

import CredentialCard from "./CredentialCard";

export interface DocumentCredentialCardContext {
	activeDid: ActiveDid;
	lastTokenSync: string[] | null;
	knownIssuers: IssuerRegistry;
	specialCredentials: SpecialCredentialMap;
}

export function extractContext(storeState: StoreContent): DocumentCredentialCardContext {
	return {
		activeDid: storeState.did,
		knownIssuers: storeState.knownIssuers,
		lastTokenSync: storeState.tokensInLastSync,
		specialCredentials: storeState.activeSpecialCredentials
	};
}

type CredentialState = "share" | "identity" | "revoked" | "obsolete" | "normal";

export function credentialState(document: CredentialDocument, context: DocumentCredentialCardContext): CredentialState {
	const specialType = document.specialFlag?.type;
	const activeDid = context.activeDid;
	const lastSync = context.lastTokenSync;

	if (activeDid && activeDid.did && activeDid.did() !== document.subject.did()) {
		return "share";
	} else if (specialType) {
		const special = context.specialCredentials[specialType];
		if (special === undefined) {
			return "identity";
		} else if (special.jwt !== document.jwt) {
			return "obsolete";
		} else {
			return "identity";
		}
	} else if (lastSync && !lastSync.includes(document.jwt)) {
		return "revoked";
	} else {
		return "normal";
	}
}

interface DocumentCredentialCardProps {
	preview: boolean;
	document: CredentialDocument;
	context: DocumentCredentialCardContext;
}

interface CredentialStyle {
	color: string;
	hollow: boolean;
}

const credentialStyles: Record<CredentialState, CredentialStyle> = {
	normal: {
		color: colors.secondary,
		hollow: false
	},
	identity: {
		color: colors.secondary,
		hollow: true
	},
	revoked: {
		color: colors.backgroundSeparator,
		hollow: false
	},
	obsolete: {
		color: colors.backgroundSeparator,
		hollow: false
	},
	share: {
		color: colors.text,
		hollow: false
	}
};

export class DocumentCredentialCard extends React.Component<DocumentCredentialCardProps> {
	private issuerText(did: EthrDID): string {
		const issuerData = this.props.context.knownIssuers[did.did()];
		const issuerName = issuerData
			? issuerData.name === null
				? strings.credentialCard.emitter.unknown
				: strings.credentialCard.emitter.known(issuerData.name)
			: strings.credentialCard.emitter.loading;
		return this.props.preview ? issuerName : `${issuerName}\n${strings.credentialCard.emitter.id + did.keyAddress()}`;
	}

	render() {
		const doc = this.props.document;

		const issuerText = this.issuerText(CredentialDocument.displayedIssuer(doc));

		const category = doc.issuedAt ? strings.credentialCard.formatDate(new Date(doc.issuedAt * 1000)) : "Credencial";

		let title = doc.title;
		let data = this.props.preview
			? CredentialDocument.extractPreviewDataPairs(doc)
			: CredentialDocument.extractAllDataPairs(doc);
		const specialType = doc.specialFlag?.type;
		if (specialType) {
			const dictionary: { title: string; [name: string]: string | undefined } = strings.specialCredentials[specialType];
			title = dictionary.title;
			data = data.map(({ label, value }) => ({
				label: dictionary[label] ?? label,
				value
			}));
		}

		const styleType = credentialState(this.props.document, this.props.context);
		const style = credentialStyles[styleType];

		return (
			<CredentialCard
				icon=""
				category={category}
				title={title}
				subTitle={issuerText}
				data={data}
				columns={this.props.preview ? CredentialDocument.numberOfColumns(doc) : 1}
				color={style.color}
				hollow={style.hollow}
			>
				{this.props.children}
				{this.renderTypeMessage(styleType)}
			</CredentialCard>
		);
	}

	private renderTypeMessage(type: CredentialState): JSX.Element | undefined {
		switch (type) {
			case "normal":
			case "identity":
				return undefined;
			case "revoked":
				return (
					<DidiText.Card.Warning style={{ color: "#FFF", marginTop: 10 }}>
						{strings.credentialCard.revoked}
					</DidiText.Card.Warning>
				);
			case "obsolete":
				return (
					<DidiText.Card.Warning style={{ color: "#FFF", marginTop: 10 }}>
						{strings.credentialCard.replaced}
					</DidiText.Card.Warning>
				);
			case "share":
				return (
					<DidiText.Card.Warning style={{ color: "#FFF", marginTop: 10 }}>
						{strings.credentialCard.shared}
					</DidiText.Card.Warning>
				);
			default:
				assertUnreachable(type);
		}
	}
}
