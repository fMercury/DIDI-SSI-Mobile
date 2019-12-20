import { verifyJWT } from "did-jwt";
import { verifyCredential } from "did-jwt-vc";
import { Resolver } from "did-resolver";
import { getResolver } from "ethr-did-resolver";
import { array, separate } from "fp-ts/lib/Array";
import { Either, either, isLeft, isRight, left, right } from "fp-ts/lib/Either";
import * as t from "io-ts";
import JWTDecode from "jwt-decode";

import TypedArray from "../util/TypedArray";

import { CredentialDocument } from "../model/CredentialDocument";
import { RequestDocument } from "../model/RequestDocument";

import { JWTParseError } from "./JWTParseError";
import { ForwardedRequestCodec } from "./types/ForwardedRequest";
import { SelectiveDisclosureRequestCodec } from "./types/SelectiveDisclosureRequest";
import { VerifiedClaim, VerifiedClaimCodec } from "./types/VerifiedClaim";

// This is required by verifyJWT
if (typeof Buffer === "undefined") {
	// tslint:disable-next-line: no-var-requires
	global.Buffer = require("buffer").Buffer;
}

const PublicCodec = t.union([SelectiveDisclosureRequestCodec, VerifiedClaimCodec]);
const ParseCodec = t.union([PublicCodec, ForwardedRequestCodec]);

export type JWTParseResult = Either<JWTParseError, RequestDocument | CredentialDocument>;

function extractIoError(errors: t.Errors): string {
	return TypedArray.flatMap(errors, e => e.message).join(", ") + ".";
}

export function unverifiedParseJWT(jwt: string): JWTParseResult {
	try {
		const decoded = JWTDecode(jwt);
		const parsed = ParseCodec.decode(decoded);
		if (isLeft(parsed)) {
			return left(new JWTParseError({ type: "SHAPE_DECODE_ERROR", errorMessage: extractIoError(parsed.left) }));
		}

		const unverified = parsed.right;
		const now = Math.floor(Date.now() / 1000);
		if (unverified.expireAt !== undefined && unverified.expireAt < now) {
			return left(new JWTParseError({ type: "AFTER_EXP", expected: unverified.expireAt, current: now }));
		} else if (unverified.issuedAt !== undefined && now < unverified.issuedAt) {
			return left(new JWTParseError({ type: "BEFORE_IAT", expected: unverified.issuedAt, current: now }));
		} else {
			switch (unverified.type) {
				case "SelectiveDisclosureRequest":
					return right({ ...unverified, type: "RequestDocument", jwt });
				case "ForwardedRequest":
					return unverifiedParseJWT(unverified.forwarded);
				case "VerifiedClaim":
					const nested = parseNestedInUnverified(unverified);
					if (isLeft(nested)) {
						return nested;
					} else {
						return right({ ...unverified, type: "CredentialDocument", jwt, nested: nested.right });
					}
			}
		}
	} catch (e) {
		return left(new JWTParseError({ type: "JWT_DECODE_ERROR", error: e }));
	}
}

export default async function parseJWT(jwt: string, ethrUri: string): Promise<JWTParseResult> {
	const unverifiedContent = unverifiedParseJWT(jwt);
	if (isLeft(unverifiedContent)) {
		return unverifiedContent;
	}

	try {
		const ethrDidResolver = getResolver({
			rpcUrl: ethrUri
		});
		const resolver = new Resolver({
			...ethrDidResolver
		});

		try {
			const { payload } = await (unverifiedContent.right.type === "CredentialDocument"
				? verifyCredential(jwt, resolver)
				: verifyJWT(jwt, { resolver }));

			const parsed = ParseCodec.decode(payload);
			if (isLeft(parsed)) {
				return left(new JWTParseError({ type: "SHAPE_DECODE_ERROR", errorMessage: extractIoError(parsed.left) }));
			}

			const verified = parsed.right;
			switch (verified.type) {
				case "SelectiveDisclosureRequest":
					return right({ ...verified, type: "RequestDocument", jwt });
				case "ForwardedRequest":
					return parseJWT(verified.forwarded, ethrUri);
				case "VerifiedClaim":
					const nested = await parseNestedInVerified(verified, ethrUri);
					if (isLeft(nested)) {
						return left(nested.left);
					} else {
						return right({ ...verified, type: "CredentialDocument", jwt, nested: nested.right });
					}
			}
		} catch (e) {
			return left(new JWTParseError({ type: "VERIFICATION_ERROR", error: e }));
		}
	} catch (e) {
		return left(new JWTParseError({ type: "RESOLVER_CREATION_ERROR" }));
	}
}

function extractCredentials(
	items: Array<RequestDocument | CredentialDocument>
): Either<JWTParseError, CredentialDocument[]> {
	if (items.every(x => x.type === "CredentialDocument")) {
		return right(items as CredentialDocument[]);
	} else {
		return left(new JWTParseError({ type: "NONCREDENTIAL_WRAP_ERROR" }));
	}
}

function parseNestedInUnverified(vc: VerifiedClaim): Either<JWTParseError, CredentialDocument[]> {
	const nested = Object.values(vc.claims.wrapped);
	const parsed = nested.map(unverifiedParseJWT);
	const mix = array.sequence(either)(parsed);
	if (isLeft(mix)) {
		return mix;
	} else {
		return extractCredentials(mix.right);
	}
}

async function parseNestedInVerified(
	vc: VerifiedClaim,
	ethrUri: string
): Promise<Either<JWTParseError, CredentialDocument[]>> {
	const nested = Object.values(vc.claims.wrapped);
	const parsed = await Promise.all(nested.map(micro => parseJWT(micro, ethrUri)));
	const mix = array.sequence(either)(parsed);
	if (isLeft(mix)) {
		return mix;
	} else {
		return extractCredentials(mix.right);
	}
}
