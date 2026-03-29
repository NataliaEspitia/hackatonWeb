"use client";

import { ChangeEvent, useMemo, useState } from "react";

export default function BarraDeProgreso() {
	const [inputPorcentaje, setInputPorcentaje] = useState("10");

	const { porcentaje, error } = useMemo(() => {
		if (inputPorcentaje.trim() === "") {
			return { porcentaje: 0, error: "Ingresa un valor entre 0 y 100." };
		}

		const valor = Number(inputPorcentaje);
		if (!Number.isFinite(valor)) {
			return { porcentaje: 0, error: "Solo se permiten numeros." };
		}

		if (valor < 0 || valor > 100) {
			return { porcentaje: 0, error: "El porcentaje debe estar entre 0 y 100." };
		}

		return { porcentaje: valor, error: "" };
	}, [inputPorcentaje]);

	const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
		setInputPorcentaje(event.target.value);
	};

	return (
		<section className="mx-auto mt-10 w-full max-w-xl rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm">
			<h2 className="mb-8 text-center text-4xl font-semibold text-zinc-900">Progress bar</h2>

			<div className="relative mb-8 h-8 w-full rounded-full bg-zinc-300">
				<div
					className="h-full rounded-full bg-rose-400 transition-all duration-300"
					style={{ width: `${porcentaje}%` }}
				/>
				<span className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-rose-400 px-2 py-1 text-sm font-semibold text-white shadow">
					{porcentaje}%
				</span>
			</div>

			<label className="flex items-center justify-center gap-4 text-2xl font-medium text-zinc-900" htmlFor="porcentaje-input">
				<span>Input Percentage:</span>
				<input
					id="porcentaje-input"
					type="number"
					min={0}
					max={100}
					step={1}
					value={inputPorcentaje}
					onChange={handleInputChange}
					className="w-28 rounded-full border-2 border-zinc-600 bg-white px-4 py-2 text-center text-lg text-zinc-900 outline-none transition focus:border-rose-400"
					aria-invalid={Boolean(error)}
					aria-describedby="porcentaje-error"
				/>
			</label>

			<p id="porcentaje-error" className="mt-3 min-h-6 text-center text-sm font-medium text-red-600">
				{error}
			</p>
		</section>
	);
}
