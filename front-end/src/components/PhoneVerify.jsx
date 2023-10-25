import { useState } from "react";

export default function PhoneVerify() {
  const [code, setCode] = useState("");
  const handlSubmit = (e) => {
    e.preventDefault();
    console.log({ code });
  };
  return (
    <div className="verify">
      <h2 style={{ marginBottom: "30px" }}>Verify your Phone number</h2>
      <form className="verify__form" onSubmit={handlSubmit}>
        <labe htmlFor="code" style={{ marginBottom: "10px" }}>
          A code has been sent your phone
        </labe>
        <input
          type="text"
          name="code"
          id="code"
          className="code"
          defaultValue={code}
          onChange={(e) => setCode(e.target.value)}
          required
        />
        <button className="codeBtn">AUTHENTICATE</button>
      </form>
    </div>
  );
}
