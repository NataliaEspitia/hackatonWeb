"use client";

import { useMemo, useState } from "react";

const LOWERCASE = "abcdefghijklmnopqrstuvwxyz";
const UPPERCASE = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const NUMBERS = "0123456789";
const SPECIAL = "!@#$%^&*()-_=+[]{};:,.?/";

type Strength = "Very Weak" | "Weak" | "Medium" | "Strong";

function secureRandomInt(max: number): number {
	if (max <= 0) {
		return 0;
	}

	const limit = Math.floor(0xffffffff / max) * max;
	const randomArray = new Uint32Array(1);

	let value = 0;
	do {
		globalThis.crypto.getRandomValues(randomArray);
		value = randomArray[0] ?? 0;
	} while (value >= limit);

	return value % max;
}

function shuffleSecure(chars: string[]): string[] {
	const clone = [...chars];

	for (let index = clone.length - 1; index > 0; index -= 1) {
		const randomIndex = secureRandomInt(index + 1);
		[clone[index], clone[randomIndex]] = [clone[randomIndex], clone[index]];
	}

	return clone;
}

function getStrength(length: number, activeSets: number): Strength {
	const score = length + activeSets * 4;

	if (score <= 14) {
		return "Very Weak";
	}
	if (score <= 24) {
		return "Weak";
	}
	if (score <= 34) {
		return "Medium";
	}

	return "Strong";
}

export default function GeneratorPassword() {
	const [length, setLength] = useState(10);
	const [includeUppercase, setIncludeUppercase] = useState(true);
	const [includeLowercase, setIncludeLowercase] = useState(true);
	const [includeNumbers, setIncludeNumbers] = useState(true);
	const [includeSpecial, setIncludeSpecial] = useState(false);
	const [nonce, setNonce] = useState(0);
	const [copyMessage, setCopyMessage] = useState("");

	const activeSets = useMemo(() => {
		return [includeUppercase, includeLowercase, includeNumbers, includeSpecial].filter(Boolean).length;
	}, [includeUppercase, includeLowercase, includeNumbers, includeSpecial]);

	const strength = useMemo(() => getStrength(length, activeSets), [length, activeSets]);
	const errorMessage = activeSets === 0 ? "Selecciona al menos un tipo de caracter." : "";

	const password = useMemo(() => {
		const selectedPools: string[] = [];
		const warmupSteps = nonce % 7;

		for (let index = 0; index < warmupSteps; index += 1) {
			secureRandomInt(1000);
		}

		if (includeUppercase) {
			selectedPools.push(UPPERCASE);
		}
		if (includeLowercase) {
			selectedPools.push(LOWERCASE);
		}
		if (includeNumbers) {
			selectedPools.push(NUMBERS);
		}
		if (includeSpecial) {
			selectedPools.push(SPECIAL);
		}

		if (selectedPools.length === 0) {
			return "";
		}

		const normalizedLength = Math.max(length, selectedPools.length);
		const mandatoryChars = selectedPools.map((pool) => pool[secureRandomInt(pool.length)] ?? "");
		const allChars = selectedPools.join("");
		const generatedChars = [...mandatoryChars];

		while (generatedChars.length < normalizedLength) {
			generatedChars.push(allChars[secureRandomInt(allChars.length)] ?? "");
		}

		return shuffleSecure(generatedChars).join("");
	}, [length, includeUppercase, includeLowercase, includeNumbers, includeSpecial, nonce]);

	const generatePassword = () => {
		setNonce((prev) => prev + 1);
		setCopyMessage("");
	};

	const handleCopy = async () => {
		if (!password) {
			setCopyMessage("No hay contrasena para copiar.");
			return;
		}

		try {
			await globalThis.navigator.clipboard.writeText(password);
			setCopyMessage("Contrasena copiada.");
		} catch {
			setCopyMessage("No se pudo copiar automaticamente.");
		}
	};

	return (
		<section className="mx-auto mt-10 w-full max-w-4xl rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm">
			<h2 className="text-center text-4xl font-extrabold text-zinc-900">PASSWORD GENERATOR</h2>
			<p className="mt-2 text-center text-lg text-zinc-600">
				Create strong and secure passwords to keep your account safe online.
			</p>

			<div className="mt-6 flex flex-col gap-3 md:flex-row md:items-center">
				<input
					type="text"
					value={password}
					readOnly
					className="w-full rounded-xl border border-zinc-400 px-4 py-3 text-lg text-zinc-900"
					aria-label="Generated password"
				/>
				<button
					type="button"
					onClick={generatePassword}
					className="rounded-xl border border-zinc-400 bg-white px-4 py-3 text-base font-semibold text-zinc-900 hover:bg-zinc-100"
				>
					Regenerate
				</button>
				<button
					type="button"
					onClick={handleCopy}
					className="rounded-xl bg-cyan-400 px-6 py-3 text-base font-semibold text-zinc-900 hover:bg-cyan-300"
				>
					Copy
				</button>
			</div>

			<p className="mt-2 min-h-5 text-sm font-semibold text-amber-600">{strength}</p>
			<p className="min-h-5 text-sm text-red-600">{errorMessage}</p>
			<p className="min-h-5 text-sm text-emerald-700">{copyMessage}</p>

			<div className="mt-6">
				<label htmlFor="password-length" className="mb-2 block text-lg font-semibold text-zinc-900">
					Password Length: {length}
				</label>
				<input
					id="password-length"
					type="range"
					min={6}
					max={32}
					value={length}
					onChange={(event) => {
						setLength(Number(event.target.value));
						setCopyMessage("");
					}}
					className="w-full"
				/>
			</div>

			<div className="mt-6 grid gap-4 sm:grid-cols-2">
				<label className="flex items-center justify-between rounded-lg border border-zinc-200 px-3 py-2 text-base text-zinc-900">
					<span>Uppercase</span>
					<input
						type="checkbox"
						checked={includeUppercase}
						onChange={(event) => {
							setIncludeUppercase(event.target.checked);
							setCopyMessage("");
						}}
					/>
				</label>

				<label className="flex items-center justify-between rounded-lg border border-zinc-200 px-3 py-2 text-base text-zinc-900">
					<span>Lowercase</span>
					<input
						type="checkbox"
						checked={includeLowercase}
						onChange={(event) => {
							setIncludeLowercase(event.target.checked);
							setCopyMessage("");
						}}
					/>
				</label>

				<label className="flex items-center justify-between rounded-lg border border-zinc-200 px-3 py-2 text-base text-zinc-900">
					<span>Numbers</span>
					<input
						type="checkbox"
						checked={includeNumbers}
						onChange={(event) => {
							setIncludeNumbers(event.target.checked);
							setCopyMessage("");
						}}
					/>
				</label>

				<label className="flex items-center justify-between rounded-lg border border-zinc-200 px-3 py-2 text-base text-zinc-900">
					<span>Special Characters</span>
					<input
						type="checkbox"
						checked={includeSpecial}
						onChange={(event) => {
							setIncludeSpecial(event.target.checked);
							setCopyMessage("");
						}}
					/>
				</label>
			</div>
		</section>
	);
}
