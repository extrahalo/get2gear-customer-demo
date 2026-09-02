"use client";

import { FormEvent, useState } from "react";

type RequestOption = { value: string; label: string };

type ContactRequestFormProps = {
  email: string;
  copy: {
    formLabel: string;
    formTitle: string;
    requestType: string;
    name: string;
    phone: string;
    email: string;
    message: string;
    submit: string;
    submitted: string;
    options: RequestOption[];
  };
};

export default function ContactRequestForm({ email, copy }: ContactRequestFormProps) {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const requestType = copy.options.find((option) => option.value === data.get("requestType"))?.label ?? "";
    const body = [
      `${copy.requestType}: ${requestType}`,
      `${copy.name}: ${data.get("name")}`,
      `${copy.phone}: ${data.get("phone")}`,
      `${copy.email}: ${data.get("email")}`,
      "",
      `${copy.message}:`,
      data.get("message"),
    ].join("\n");

    setSubmitted(true);
    window.location.href = `mailto:${email}?subject=${encodeURIComponent(`${requestType} — Get2Gear`)}&body=${encodeURIComponent(body)}`;
  }

  return (
    <form className="request-form" onSubmit={handleSubmit}>
      <div className="request-form__heading">
        <p>{copy.formLabel}</p>
        <h3>{copy.formTitle}</h3>
      </div>
      <div className="request-form__fields">
        <label>
          <span>{copy.requestType}</span>
          <select name="requestType" defaultValue={copy.options[0]?.value}>
            {copy.options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
          </select>
        </label>
        <label>
          <span>{copy.name}</span>
          <input name="name" autoComplete="name" required />
        </label>
        <label>
          <span>{copy.phone}</span>
          <input name="phone" type="tel" autoComplete="tel" required />
        </label>
        <label>
          <span>{copy.email}</span>
          <input name="email" type="email" autoComplete="email" required />
        </label>
        <label className="request-form__message">
          <span>{copy.message}</span>
          <textarea name="message" rows={4} required />
        </label>
      </div>
      <div className="request-form__submit">
        <button className="button button--ink" type="submit">{copy.submit} <span aria-hidden="true">↗</span></button>
        {submitted ? <p role="status">{copy.submitted}</p> : null}
      </div>
    </form>
  );
}
