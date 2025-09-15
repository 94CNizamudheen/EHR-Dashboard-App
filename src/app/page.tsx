"use client";
export default function HomePage() {
  const authUrl = `${process.env.NEXT_PUBLIC_AUTH_URL}?response_type=code&client_id=${process.env.NEXT_PUBLIC_CLIENT_ID}&redirect_uri=${process.env.NEXT_PUBLIC_REDIRECT_URI}&scope=launch/patient patient/Patient.read patient/Patient.write openid fhirUser&state=123`;

  function login() {
    window.location.href = authUrl;
  }

  return (
    <div>
      <h1>Welcome to EHR Dashboard</h1>
      <button onClick={login}>🔐 Login with Oracle</button>
    </div>
  );
}
