"use client";

import { ChangeEvent, SyntheticEvent, useMemo, useState } from "react";

type FormValues = {
	userName: string;
	fullName: string;
	age: string;
};

type FormErrors = {
	userName: string;
	fullName: string;
	age: string;
};

type SubmittedData = {
	userName: string;
	fullName: string;
	age: number;
};

const initialValues: FormValues = {
	userName: "",
	fullName: "",
	age: "",
};

const initialErrors: FormErrors = {
	userName: "",
	fullName: "",
	age: "",
};

function validateValues(values: FormValues): FormErrors {
	const errors: FormErrors = { ...initialErrors };

	const normalizedUserName = values.userName.trim();
	const normalizedFullName = values.fullName.trim();

	if (!normalizedUserName) {
		errors.userName = "El nombre de usuario es obligatorio.";
	} else if (normalizedUserName.length < 3) {
		errors.userName = "Debe tener al menos 3 caracteres.";
	} else if (!/^\w+$/.test(normalizedUserName)) {
		errors.userName = "Solo se permiten letras, numeros y guion bajo (_).";
	}

	if (!normalizedFullName) {
		errors.fullName = "El nombre completo es obligatorio.";
	} else if (normalizedFullName.length < 5) {
		errors.fullName = "Debe tener al menos 5 caracteres.";
	} else if (!/^[a-zA-Z\s]+$/.test(normalizedFullName)) {
		errors.fullName = "Solo se permiten letras y espacios.";
	}

	if (values.age.trim().length === 0) {
		errors.age = "La edad es obligatoria.";
	} else {
		const parsedAge = Number(values.age);

		if (!Number.isInteger(parsedAge)) {
			errors.age = "La edad debe ser un numero entero.";
		} else if (parsedAge < 18 || parsedAge > 120) {
			errors.age = "La edad debe estar entre 18 y 120.";
		}
	}

	return errors;
}

function hasErrors(errors: FormErrors): boolean {
	return Object.values(errors).some((error) => error.length > 0);
}

export default function Form() {
	const [values, setValues] = useState<FormValues>(initialValues);
	const [errors, setErrors] = useState<FormErrors>(initialErrors);
	const [touched, setTouched] = useState<Record<keyof FormValues, boolean>>({
		userName: false,
		fullName: false,
		age: false,
	});
	const [submittedData, setSubmittedData] = useState<SubmittedData | null>(null);
	const [submitMessage, setSubmitMessage] = useState("");

	const isFormValid = useMemo(() => {
		const validationErrors = validateValues(values);
		return !hasErrors(validationErrors);
	}, [values]);

	const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
		const { name, value } = event.target;

		setValues((prev) => ({
			...prev,
			[name]: value,
		}));

		const updatedValues = {
			...values,
			[name]: value,
		};

		setErrors(validateValues(updatedValues));
		setSubmitMessage("");
	};

	const handleBlur = (field: keyof FormValues) => {
		setTouched((prev) => ({ ...prev, [field]: true }));
		setErrors(validateValues(values));
	};

	const handleSubmit = (event: SyntheticEvent<HTMLFormElement>) => {
		event.preventDefault();

		const validationErrors = validateValues(values);
		setErrors(validationErrors);
		setTouched({ userName: true, fullName: true, age: true });

		if (hasErrors(validationErrors)) {
			setSubmitMessage("Corrige los errores antes de enviar el formulario.");
			return;
		}

		const payload: SubmittedData = {
			userName: values.userName.trim(),
			fullName: values.fullName.trim(),
			age: Number(values.age),
		};

		setSubmittedData(payload);
		setSubmitMessage("Formulario enviado correctamente.");
	};

	const getError = (field: keyof FormErrors) => {
		if (!touched[field]) {
			return "";
		}

		return errors[field];
	};

	return (
		<section className="mx-auto mt-10 w-full max-w-4xl rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm">
			<div className="grid gap-8 md:grid-cols-2">
				<form noValidate onSubmit={handleSubmit} className="space-y-6">
					<h2 className="text-3xl font-semibold text-zinc-900">Formulario de registro</h2>

					<div>
						<label className="mb-2 block text-xl font-semibold text-zinc-900" htmlFor="userName">
							Username:
						</label>
						<input
							id="userName"
							name="userName"
							type="text"
							value={values.userName}
							onChange={handleChange}
							onBlur={() => handleBlur("userName")}
							className="w-full rounded-md border border-zinc-500 px-3 py-2 text-lg text-zinc-900 outline-none transition focus:border-sky-500"
							placeholder="ej: usuario_123"
							aria-invalid={Boolean(getError("userName"))}
							aria-describedby="userName-error"
						/>
						<p id="userName-error" className="mt-1 min-h-5 text-sm font-medium text-red-600">
							{getError("userName")}
						</p>
					</div>

					<div>
						<label className="mb-2 block text-xl font-semibold text-zinc-900" htmlFor="fullName">
							FullName:
						</label>
						<input
							id="fullName"
							name="fullName"
							type="text"
							value={values.fullName}
							onChange={handleChange}
							onBlur={() => handleBlur("fullName")}
							className="w-full rounded-md border border-zinc-500 px-3 py-2 text-lg text-zinc-900 outline-none transition focus:border-sky-500"
							placeholder="ej: Maria Lopez"
							aria-invalid={Boolean(getError("fullName"))}
							aria-describedby="fullName-error"
						/>
						<p id="fullName-error" className="mt-1 min-h-5 text-sm font-medium text-red-600">
							{getError("fullName")}
						</p>
					</div>

					<div>
						<label className="mb-2 block text-xl font-semibold text-zinc-900" htmlFor="age">
							Age:
						</label>
						<input
							id="age"
							name="age"
							type="number"
							value={values.age}
							onChange={handleChange}
							onBlur={() => handleBlur("age")}
							className="w-full rounded-md border border-zinc-500 px-3 py-2 text-lg text-zinc-900 outline-none transition focus:border-sky-500"
							placeholder="ej: 30"
							min={18}
							max={120}
							aria-invalid={Boolean(getError("age"))}
							aria-describedby="age-error"
						/>
						<p id="age-error" className="mt-1 min-h-5 text-sm font-medium text-red-600">
							{getError("age")}
						</p>
					</div>

					<button
						type="submit"
						className="rounded-md border border-zinc-500 bg-zinc-100 px-4 py-2 text-lg font-semibold text-zinc-900 transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-60"
						disabled={!isFormValid}
					>
						Submit
					</button>

					<p className="min-h-6 text-base font-medium text-zinc-700">{submitMessage}</p>
				</form>

				<aside className="rounded-xl bg-zinc-50 p-6">
					<h3 className="mb-4 text-2xl font-semibold text-zinc-900">Datos enviados</h3>
					{submittedData ? (
						<ul className="list-disc space-y-2 pl-6 text-4xl text-zinc-900">
							<li>UserName: {submittedData.userName.toUpperCase()}</li>
							<li>FullName: {submittedData.fullName.toUpperCase()}</li>
							<li>Age: {submittedData.age}</li>
						</ul>
					) : (
						<p className="text-lg text-zinc-600">Aun no hay informacion enviada.</p>
					)}
				</aside>
			</div>
		</section>
	);
}
